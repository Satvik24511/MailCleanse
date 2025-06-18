'use client';

import type { NextPage } from 'next';
import React from 'react';
import { Mail, CheckCircle, Shield, Github, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

const Home: NextPage = () => {
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section
        className="
          min-h-screen
          flex flex-col
          justify-center
          items-center
          text-center
          relative
          overflow-hidden
          bg-gradient-to-br
          from-blue-200 to-green-200
          p-4 sm:p-6 md:p-8
        "
      >
        <div
          className="
            absolute inset-0
            w-full h-full
            opacity-40
            z-0
            flex items-center justify-center
            bg-blue-100/50
          "
          aria-hidden="true" 
        >
        </div>

        {/* Main Content */}
        <h1
          className="
            text-4xl sm:text-5xl md:text-6xl lg:text-7xl
            font-extrabold
            text-gray-900
            mb-4
            max-w-3xl
            mx-auto
            leading-tight
            relative z-10
          "
        >
          Reclaim Your Inbox with <span className="text-orange-500">MailCleanse</span>.
        </h1>

        <p
          className="
            text-lg sm:text-xl md:text-2xl
            text-gray-700
            font-medium
            mb-8 md:mb-10
            max-w-xl
            mx-auto
            relative z-10
          "
        >
          Find Your Peace.
        </p>

        <Button
          className="
            bg-orange-500
            text-white
            py-4 px-10
            rounded-full
            text-lg md:text-xl
            font-semibold
            cursor-pointer
            transition-all duration-300 ease-in-out
            shadow-lg hover:shadow-xl
            hover:scale-105
            hover:bg-orange-600
            relative z-10
          "
        >
          Get Started
        </Button>
      </section>

      {/* --- What We Do Section --- */}
      <motion.section
        className="py-16 sm:py-24 bg-gradient-to-br from-green-50 to-blue-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-screen-xl mx-auto px-4">
          <motion.h2
            className="text-4xl font-extrabold text-gray-900 text-center mb-12 sm:mb-16"
            variants={cardVariants}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            What <span className="text-primary-blue">MailCleanse</span> Does
          </motion.h2>

          <motion.div
            className="grid md:grid-cols-3 gap-10 lg:gap-16 text-left"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }} 
            transition={{ staggerChildren: 0.2 }} 
          >

            <motion.div variants={cardVariants} transition={{ duration: 0.7 }}>
              <Card className="rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1">
                <CardHeader className="flex flex-col items-center pb-0">
                  <div className="flex items-center justify-center w-16 h-16 bg-primary-blue/10 rounded-full mb-6">
                    <Mail className="w-8 h-8 text-primary-blue" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-4 text-center">
                    Discover Subscriptions
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 pb-6">
                  <p className="text-gray-700 leading-relaxed text-center">
                    MailCleanse intelligently scans your Gmail inbox to identify hidden subscription emails that you might have forgotten about.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants} transition={{ duration: 0.7 }}>
              <Card className="rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1">
                <CardHeader className="flex flex-col items-center pb-0">
                  <div className="flex items-center justify-center w-16 h-16 bg-orange-500/10 rounded-full mb-6">
                    <CheckCircle className="w-8 h-8 text-orange-500" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-4 text-center">
                    Unsubscribe Effortlessly
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 pb-6">
                  <p className="text-gray-700 leading-relaxed text-center">
                    With a single click, MailCleanse attempts to unsubscribe you from unwanted newsletters and promotional emails, saving you time and hassle.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants} transition={{ duration: 0.7 }}>
              <Card className="rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1">
                <CardHeader className="flex flex-col items-center pb-0">
                  <div className="flex items-center justify-center w-16 h-16 bg-primary-green/10 rounded-full mb-6">
                    <Shield className="w-8 h-8 text-primary-green" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-4 text-center">
                    Secure & Private
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 pb-6">
                  <p className="text-gray-700 leading-relaxed text-center">
                    Your data security is our top priority. We only request the necessary Gmail permissions and never read your personal email content.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* --- Why We Ask Section --- */}
      <motion.section
        className="py-16 sm:py-24 bg-gray-100"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-screen-xl mx-auto px-4">
          <motion.h2
            className="text-4xl font-extrabold text-gray-900 text-center mb-12 sm:mb-16"
            variants={cardVariants}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Why We Ask: Your Privacy & Our Process
          </motion.h2>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 text-left"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ staggerChildren: 0.15 }}
          >
            <motion.div variants={cardVariants} transition={{ duration: 0.6 }}>
              <Card className="rounded-xl shadow-md">
                <CardHeader className="flex-row items-center pb-2">
                  <Mail className="w-6 h-6 text-primary-blue mr-3 flex-shrink-0" />
                  <CardTitle className="text-xl font-bold text-gray-900">
                    Read Email Headers (`gmail.readonly`)
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <p className="text-gray-700 leading-relaxed text-sm">
                    This permission allows MailCleanse to read crucial email headers like "From", "Subject", and the "List-Unsubscribe" header which contains unsubscribe links. We do not access your email body content or attachments.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants} transition={{ duration: 0.6 }}>
              <Card className="rounded-xl shadow-md">
                <CardHeader className="flex-row items-center pb-2">
                  <CheckCircle className="w-6 h-6 text-orange-500 mr-3 flex-shrink-0" />
                  <CardTitle className="text-xl font-bold text-gray-900">
                    Modify Emails (`gmail.modify`)
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <p className="text-gray-700 leading-relaxed text-sm">
                    After a successful unsubscribe attempt, we use this to mark the original subscription email as "read" and move it to your trash, helping you keep your inbox tidy.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants} transition={{ duration: 0.6 }}>
              <Card className="rounded-xl shadow-md">
                <CardHeader className="flex-row items-center pb-2">
                  <Shield className="w-6 h-6 text-primary-green mr-3 flex-shrink-0" />
                  <CardTitle className="text-xl font-bold text-gray-900">
                    Access Basic Profile & Email
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <p className="text-gray-700 leading-relaxed text-sm">
                    We request your basic profile (name, profile picture) and email address to personalize your experience and manage your MailCleanse account. This is standard for Google logins.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* --- Footer Section --- */}
      <motion.footer
        className="bg-gray-800 text-white py-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-screen-xl mx-auto px-4 text-center">
          <motion.h3
            className="text-2xl font-bold mb-6"
            variants={cardVariants} 
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Connect with the Developer
          </motion.h3>
          <motion.div
            className="flex justify-center space-x-6 mb-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <motion.a
              href="https://github.com/Satvik24511" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition-colors duration-200"
              aria-label="GitHub Profile"
              variants={cardVariants}
            >
              <Github className="w-8 h-8" />
            </motion.a>
            <motion.a
              href="https://www.linkedin.com/in/stvkmittal"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition-colors duration-200"
              aria-label="LinkedIn Profile"
              variants={cardVariants}
            >
              <Linkedin className="w-8 h-8" />
            </motion.a>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
};

export default Home;
