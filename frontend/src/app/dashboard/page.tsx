'use client';

import type { NextPage } from 'next';
import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, CheckCircle, Shield, History, EyeOff, XCircle, Clock, CalendarDays, Rocket, Info, Loader2, LogOut, ChevronLeft, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardTitle, CardContent } from '@/components/ui/card';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import ScanLoadingOverlay from '@/components/ScanLoading';

type RecentEmail = {
  subject: string;
  date: string;
  snippet: string;
};

type Service = {
  _id: string;
  name: string;
  description: string;
  iconUrl?: string;
  emailId: string;
  domain: string;
  emailCount: number;
  lastEmailSubject: string;
  lastEmailDate: string;
  recentEmails: RecentEmail[];
  oneClickPost: boolean;
  unsubscribeUrl?: string;
  isUnsubscribed: boolean;
  createdAt: string;
  updatedAt: string;
};

type User = {
  googleId: string;
  displayName: string;
  email: string;
  profilePicture?: string;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
  unsubscribedCount: number;
  totalServices: number;
  unreadEmails: number;
  services: Service[];
  lastScanDate: string | null;
  createdAt: string;
  updatedAt: string;
};

const DashboardPage: NextPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [isUnsubscribing, setIsUnsubscribing] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const servicesPerPage = 25;
  const router = useRouter();

  const getUser = async () => {
    try {
      if (!isScanning) setLoading(true);
      setError(null);

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';
      const res = await fetch(`${backendUrl}/api/auth/check`, {
        method: 'GET',
        credentials: 'include',
      });

      if (res.status === 401) {
        router.push('/');
        return;
      }

      if (!res.ok) {
        let errorText = `HTTP error! status: ${res.status}`;
        try {
          const errorData = await res.json();
          if (errorData.message) {
            errorText = errorData.message;
          }
        } catch (parseError) {
          errorText = await res.text();
        }
        throw new Error(errorText);
      }

      const data = await res.json();
      setUser(data.user);
    } catch (err: any) {
      console.error('Failed to fetch user:', err);
      setError(`Failed to load user data: ${err.message}`);
    } finally {
      if (!isScanning) setLoading(false);
    }
  };

  const handleScanServices = async () => {
    setIsScanning(true);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';
      const res = await fetch(`${backendUrl}/api/mail/subscriptions`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to scan services');
      }

      await getUser();
      setCurrentPage(1);
    } catch (err: any) {
      console.error('Scan services failed:', err);
      setError(`Scan failed: ${err.message}`);
    } finally {
      setIsScanning(false);
    }
  };

  const handleUnsubscribe = async (serviceId: string) => {
    setIsUnsubscribing(serviceId);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';
      const res = await fetch(`${backendUrl}/api/mail/unsubscribe/${serviceId}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to unsubscribe');
      }

      const responseData = await res.json();

      if (responseData.redirectionUrl) {
        window.open(responseData.redirectionUrl, '_blank');
      }

      setUser(prevUser => {
        if (!prevUser) return null;
        const updatedServices = prevUser.services.map(service =>
          service._id === serviceId ? { ...service, isUnsubscribed: true } : service
        );
        const newUnsubscribedCount = prevUser.services.find(s => s._id === serviceId)?.isUnsubscribed
          ? prevUser.unsubscribedCount
          : prevUser.unsubscribedCount + 1;

        return { ...prevUser, services: updatedServices, unsubscribedCount: newUnsubscribedCount };
      });

    } catch (err: any) {
      console.error('Unsubscribe failed:', err);
      setError(`Unsubscribe failed: ${err.message}`);
    } finally {
      setIsUnsubscribing(null);
    }
  };

  useEffect(() => {
    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sortedServices = useMemo(() => {
    if (!user || !user.services) return [];
    return [...user.services].sort((a, b) => {
      if (a.isUnsubscribed && !b.isUnsubscribed) return 1;
      if (!a.isUnsubscribed && b.isUnsubscribed) return -1;

      const dateA = new Date(a.lastEmailDate).getTime();
      const dateB = new Date(b.lastEmailDate).getTime();
      return dateB - dateA;
    });
  }, [user]);

  const isFirstScan = useMemo(
    () => user?.lastScanDate === null || user?.lastScanDate === undefined,
    [user]
  );

  const totalPages = Math.ceil(sortedServices.length / servicesPerPage);
  const indexOfLastService = currentPage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = sortedServices.slice(indexOfFirstService, indexOfLastService);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const slideInFromLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-700">
        <Loader2 className="animate-spin mr-3 h-8 w-8 text-orange-500" />
        <span className="text-2xl font-semibold">Loading your clean inbox...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 text-red-700 p-8 rounded-lg shadow-xl">
        <XCircle className="h-20 w-20 mb-6 text-red-500" />
        <p className="text-2xl font-bold mb-3 text-red-700">Error encountered!</p>
        <p className="text-lg text-center mb-6 text-gray-700">{error}</p>
        <Button
          onClick={() => router.push('/')}
          className="bg-orange-600 hover:bg-orange-700 text-white py-4 px-10 rounded-xl text-lg shadow-md"
        >
          Go to Login Page
        </Button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-700">
        <Loader2 className="animate-spin mr-3 h-8 w-8 text-orange-500" />
        <span className="text-2xl font-semibold">Redirecting to login...</span>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-green-50 min-h-screen text-gray-900 p-6 sm:p-8 md:p-12 relative">
      <AnimatePresence>
        {isScanning && <ScanLoadingOverlay isFirstScan={isFirstScan} />}
      </AnimatePresence>

      {/* Dashboard Header */}
      <motion.div
        className="flex flex-col sm:flex-row justify-between items-center mb-10 pb-6 border-b border-gray-300"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <motion.h1
          className="text-4xl sm:text-5xl font-extrabold mb-4 sm:mb-0 text-gray-900"
          variants={slideInFromLeft}
        >
          Welcome, <span className="text-orange-500">{user.displayName}</span>!
        </motion.h1>
        <motion.div
          className="flex flex-col items-end"
          variants={fadeIn}
        >
          <Button
            onClick={handleScanServices}
            disabled={isScanning}
            className="
              bg-orange-500 text-white py-3 px-8 rounded-full text-lg font-bold
              hover:bg-orange-600 transition-all duration-300 shadow-xl flex items-center
              animate-pulse-on-scan
            "
          >
            <Mail className="w-6 h-6 mr-3" /> Scan Services
          </Button>
          <p className="text-sm text-gray-600 mt-3">
            Last scanned:{' '}
            <span className="font-medium">
              {user.lastScanDate ? new Date(user.lastScanDate).toLocaleString() : 'Never'}
            </span>
          </p>
        </motion.div>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Card className="p-8 bg-white hover:bg-gray-50 transition-colors duration-300 transform hover:-translate-y-2 relative overflow-hidden group">
            <div className="absolute inset-0 bg-orange-500 opacity-5 group-hover:opacity-10 transition-opacity duration-300 rounded-xl"></div>
            <CardTitle className="text-2xl font-bold flex items-center text-gray-800 z-10 relative">
              <EyeOff className="h-7 w-7 mr-4 text-orange-500 group-hover:scale-110 transition-transform" /> Unsubscribed
            </CardTitle>
            <CardContent className="text-6xl font-extrabold text-orange-500 mt-6 text-center z-10 relative">
              {user.unsubscribedCount}
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card className="p-8 bg-white hover:bg-gray-50 transition-colors duration-300 transform hover:-translate-y-2 relative overflow-hidden group">
            <div className="absolute inset-0 bg-blue-500 opacity-5 group-hover:opacity-10 transition-opacity duration-300 rounded-xl"></div>
            <CardTitle className="text-2xl font-bold flex items-center text-gray-800 z-10 relative">
              <CheckCircle className="h-7 w-7 mr-4 text-blue-500 group-hover:scale-110 transition-transform" /> Total Services
            </CardTitle>
            <CardContent className="text-6xl font-extrabold text-blue-500 mt-6 text-center z-10 relative">
              {user.totalServices}
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card className="p-8 bg-white hover:bg-gray-50 transition-colors duration-300 transform hover:-translate-y-2 relative overflow-hidden group">
            <div className="absolute inset-0 bg-green-500 opacity-5 group-hover:opacity-10 transition-opacity duration-300 rounded-xl"></div>
            <CardTitle className="text-2xl font-bold flex items-center text-gray-800 z-10 relative">
              <Mail className="h-7 w-7 mr-4 text-green-500 group-hover:scale-110 transition-transform" /> Unread Emails
            </CardTitle>
            <CardContent className="text-6xl font-extrabold text-green-500 mt-6 text-center z-10 relative">
              {user.unreadEmails}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div
        className="mt-12 bg-white p-8 rounded-xl shadow-lg border border-gray-200"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-300">Your Services</h2>
        {sortedServices && sortedServices.length > 0 ? (
          <>
            <Accordion type="single" collapsible className="w-full">
              {currentServices.map((service, index) => (
                <motion.div
                  key={service._id || `item-${index}`}
                  variants={itemVariants}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="mb-2"
                >
                  <AccordionItem value={service._id || `item-${index}`} className="bg-gray-50 hover:bg-gray-100 transition-colors duration-200 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                    <AccordionTrigger className="flex items-center justify-between py-4 px-4">
                      <div className="flex items-center space-x-4 flex-grow text-left">
                        {/* Service Icon */}
                        {service.iconUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={service.iconUrl}
                            alt={service.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-orange-200 shadow-md"
                            onError={(e) => { (e.currentTarget as HTMLImageElement).src = `https://placehold.co/48x48/f3f4f6/6b7280?text=${service.name ? service.name.charAt(0).toUpperCase() : '?'}`; }}
                          />
                        ) : (
                          <div className="w-12 h-12 flex items-center justify-center bg-blue-100 rounded-full text-xl font-bold text-blue-800 border-2 border-blue-200 shadow-md">
                            {service.name ? service.name.charAt(0).toUpperCase() : '?'}
                          </div>
                        )}
                        {/* Service Name & Description */}
                        <div className="flex-grow">
                          <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                            {service.name || 'Unknown Service'}
                            {service.isUnsubscribed && (
                              <span className="ml-3 text-sm font-semibold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">Unsubscribed</span>
                            )}
                          </CardTitle>
                          <p className="text-gray-600 text-sm overflow-hidden text-ellipsis whitespace-nowrap max-w-full">
                            {service.description || 'No description available.'}
                          </p>
                        </div>
                        {/* Email Count */}
                        <div className="text-right flex-shrink-0 ml-4">
                          <p className="text-lg font-semibold text-orange-500">{service.emailCount} Emails</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-6 bg-gray-100 border-t border-gray-200 rounded-b-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-gray-700 text-base">
                        <p className="flex items-center"><Mail className="h-5 w-5 mr-3 text-blue-500" /> <span className="font-semibold text-gray-800">Email ID:</span> {service.emailId}</p>
                        <p className="flex items-center"><Shield className="h-5 w-5 mr-3 text-green-500" /> <span className="font-semibold text-gray-800">Domain:</span> {service.domain}</p>
                        <p className="flex items-center"><Clock className="h-5 w-5 mr-3 text-gray-500" /> <span className="font-semibold text-gray-800">Last Email:</span> {service.lastEmailDate ? new Date(service.lastEmailDate).toLocaleString() : 'N/A'}</p>
                        <p className="flex items-center"><History className="h-5 w-5 mr-3 text-gray-500" /> <span className="font-semibold text-gray-800">Added:</span> {new Date(service.createdAt).toLocaleString()}</p>
                        <p className="flex items-center"><CalendarDays className="h-5 w-5 mr-3 text-gray-500" /> <span className="font-semibold text-gray-800">Last Updated:</span> {new Date(service.updatedAt).toLocaleString()}</p>
                        {service.unsubscribeUrl && (
                          <p className="flex items-center col-span-1 md:col-span-2">
                            <Rocket className="h-5 w-5 mr-3 text-purple-500" /> <span className="font-semibold text-gray-800">Unsubscribe Link:</span>{' '}
                            <a href={service.unsubscribeUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700 hover:underline transition-colors">
                              Visit Unsubscribe Page
                            </a>
                          </p>
                        )}
                        <p className="flex items-center col-span-1 md:col-span-2">
                          <Info className="h-5 w-5 mr-3 text-sky-500" /> <span className="font-semibold text-gray-800">One-Click Unsubscribe Support:</span> {service.oneClickPost ? 'Yes' : 'No'}
                        </p>
                        {service.recentEmails && service.recentEmails.length > 0 && (
                          <div className="col-span-1 md:col-span-2 mt-6 p-4 bg-gray-200 rounded-lg border border-gray-300 shadow-inner">
                            <h4 className="text-xl font-bold mb-3 text-gray-900 border-b border-gray-300 pb-2">Recent Emails</h4>
                            <ul className="space-y-3">
                              {service.recentEmails.slice(0, 5).map((email, emailIdx) => (
                                <li key={emailIdx} className="bg-white p-3 rounded-md border border-gray-200 flex items-start space-x-3">
                                  <Mail className="h-4 w-4 mt-1 text-gray-500 flex-shrink-0" />
                                  <div>
                                    <p className="font-medium text-gray-900">{email.subject}</p>
                                    <p className="text-xs text-gray-600">
                                      {email.date ? new Date(email.date).toLocaleDateString() : 'N/A'}
                                    </p>
                                    <p className="text-xs text-gray-500 italic mt-1 line-clamp-2">{email.snippet}</p>
                                  </div>
                                </li>
                              ))}
                            </ul>
                            {service.recentEmails.length > 5 && (
                              <p className="text-xs text-gray-500 mt-3 text-center">
                                And {service.recentEmails.length - 5} more recent emails...
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                      {!service.isUnsubscribed && (
                        <div className="mt-8 text-center">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUnsubscribe(service._id);
                            }}
                            disabled={isUnsubscribing === service._id}
                            className="
                              bg-red-600 text-white py-3 px-8 rounded-full text-lg font-bold
                              hover:bg-red-700 transition-colors duration-300 shadow-xl flex items-center justify-center mx-auto
                              hover:scale-105
                            "
                          >
                            {isUnsubscribing === service._id ? (
                              <>
                                <Loader2 className="animate-spin mr-3 h-5 w-5" /> Unsubscribing...
                              </>
                            ) : (
                              'Unsubscribe Now'
                            )}
                          </Button>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-8">
                <Button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className="bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-md p-2 flex items-center"
                >
                  <ChevronLeft className="h-5 w-5" />
                  <span className="sr-only">Previous Page</span>
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                  <Button
                    key={pageNumber}
                    onClick={() => paginate(pageNumber)}
                    className={`
                      ${currentPage === pageNumber
                        ? 'bg-orange-500 text-white hover:bg-orange-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
                      rounded-md p-2 w-10 h-10 flex items-center justify-center
                    `}
                  >
                    {pageNumber}
                  </Button>
                ))}
                <Button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className="bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-md p-2 flex items-center"
                >
                  <ChevronRight className="h-5 w-5" />
                  <span className="sr-only">Next Page</span>
                </Button>
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-600 text-center py-8 text-xl">No services found. Click &quot;Scan Services&quot; to get started!</p>
        )}
      </motion.div>

      {/* Logout Button */}
      <motion.div
        className="mt-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <Button
          onClick={() => {
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';
            window.location.href = `${backendUrl}/api/auth/logout`;
          }}
          className="bg-gray-600 hover:bg-gray-700 text-white py-3 px-8 rounded-full shadow-md text-lg font-bold flex items-center justify-center mx-auto"
        >
          <LogOut className="h-6 w-6 mr-3" /> Logout
        </Button>
      </motion.div>
    </div>
  );
};

export default DashboardPage;