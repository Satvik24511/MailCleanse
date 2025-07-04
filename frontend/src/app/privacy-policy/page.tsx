import React from 'react';
import Link from 'next/link';
import { Mail, Shield, Info, ExternalLink, CheckCircle } from 'lucide-react'; 

export default function PrivacyPolicyPage() {
  const currentYear = new Date().getFullYear();
  const appName = "MailCleanse"; 

  return (
    <div className="min-h-screen bg-gray-50 font-inter text-gray-800">
      {/* Header */}
      <header className="bg-white shadow-sm py-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors">
            <Mail className="h-6 w-6" />
            <span className="text-xl font-semibold">{appName}</span>
          </Link>
          <nav>
            <Link href="/" className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors">
              Back to Home
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center">
          Privacy Policy for {appName}
        </h1>
        <p className="text-sm text-gray-500 mb-10 text-center">
          Last Updated: July 4, {currentYear}
        </p>

        <section className="bg-white p-8 rounded-xl shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <Shield className="h-6 w-6 text-blue-500 mr-2" />
            Our Commitment to Your Privacy
          </h2>
          <p className="mb-4 leading-relaxed">
            At {appName}, we are deeply committed to protecting your privacy and handling your data with the utmost care and transparency. This Privacy Policy explains what information we collect, how we use it, and your choices regarding your data when you use our service.
          </p>
          <p className="leading-relaxed">
            We understand the sensitivity of your email data, and our core principle is to access only what is absolutely necessary to provide our service – helping you manage your email subscriptions – and nothing more.
          </p>
        </section>

        <section className="bg-white p-8 rounded-xl shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <Info className="h-6 w-6 text-orange-500 mr-2" />
            Information We Collect
          </h2>
          <p className="mb-4 leading-relaxed">
            When you use {appName} and connect your Google account, we collect the following types of information:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4 pl-4">
            <li>
              <strong>Basic Profile Information:</strong> Your Google ID, display name, email address, and profile picture. This is used to personalize your experience within the app and manage your account.
            </li>
            <li>
              <strong>Email Headers:</strong> We access specific headers from your Gmail messages, including &quot;From,&quot; &quot;Subject,&quot; &quot;List-Unsubscribe,&quot; and &quot;List-Unsubscribe-Post.&quot; This information is crucial for identifying subscription emails and extracting unsubscribe links.
            </li>
            <li>
              <strong>Email Metadata:</strong> We collect message IDs, thread IDs, internal dates, and snippets of emails identified as subscriptions. This helps us track and organize your subscriptions.
            </li>
            <li>
              <strong>Subscription Service Data:</strong> Based on the email headers, we extract and store information about the subscription services themselves, such as sender name, email ID, domain, last email subject, last email date, and the unsubscribe URL/mailto link.
            </li>
          </ul>
          <p className="leading-relaxed font-semibold">
            We expressly state that we DO NOT access, read, or store the full content of your email messages or any attachments. Our scanning is limited to the headers required to identify and manage subscriptions.
          </p>
        </section>

        <section className="bg-white p-8 rounded-xl shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
            How We Use Your Information
          </h2>
          <p className="mb-4 leading-relaxed">
            The information we collect is used strictly for the following purposes:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4 pl-4">
            <li>
              <strong>To Provide and Improve MailCleanse:</strong> To identify and display your email subscriptions, allow you to manage them, and perform unsubscribe actions on your behalf.
            </li>
            <li>
              <strong>Personalization:</strong> To show your name and profile picture within the application for a personalized user experience.
            </li>
            <li>
              <strong>Unsubscribe Functionality:</strong> To process unsubscribe requests by either directing you to a web unsubscribe link or, if you grant the optional `gmail.send` permission, by sending an unsubscribe email on your behalf.
            </li>
            <li>
              <strong>Inbox Management:</strong> After a successful unsubscribe, we use the `gmail.modify` scope to mark the relevant email as read and move it to your trash, helping to tidy your inbox.
            </li>
            <li>
              <strong>Account Management:</strong> To track your total subscriptions and the number of emails you&lsquo;ve unsubscribed from.
            </li>
          </ul>
          <p className="leading-relaxed font-bold text-red-600">
            {appName}&lsquo;s use and transfer of information received from Google APIs to any other app will adhere to Google API Services User Data Policy, including the Limited Use requirements.
          </p>
          <p className="mt-4 leading-relaxed">
            We do not use your data for advertising, market research, or any purpose other than providing and improving the {appName} service.
          </p>
        </section>

        <section className="bg-white p-8 rounded-xl shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <Info className="h-6 w-6 text-purple-500 mr-2" />
            Information Sharing and Disclosure
          </h2>
          <p className="leading-relaxed">
            We do not share, sell, rent, or trade your personal information or Google user data with any third parties for their marketing or any other purposes. Your data remains private and is used solely within the scope of providing the {appName} service to you.
          </p>
        </section>

        <section className="bg-white p-8 rounded-xl shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <Shield className="h-6 w-6 text-teal-500 mr-2" />
            Data Security
          </h2>
          <p className="leading-relaxed">
            We implement a variety of security measures to maintain the safety of your personal information when you enter, submit, or access your personal information. We use industry-standard practices to protect your data, including encryption for data in transit and at rest, and secure authentication protocols. Access to your data is strictly limited to authorized personnel who require it to perform their duties.
          </p>
        </section>

        <section className="bg-white p-8 rounded-xl shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <Info className="h-6 w-6 text-gray-500 mr-2" />
            Your Choices and Rights
          </h2>
          <p className="mb-4 leading-relaxed">
            You have control over your data:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4 pl-4">
            <li>
              <strong>Revoke Access:</strong> You can revoke {appName}&lsquo;s access to your Google account at any time through your Google Account security settings.
            </li>
            <li>
              <strong>Delete Data:</strong> You can request the deletion of your data stored by {appName} by contacting us directly. Upon receiving your request, we will delete your account and all associated data within a reasonable timeframe.
            </li>
          </ul>
        </section>

        <section className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <Mail className="h-6 w-6 text-blue-500 mr-2" />
            Contact Us
          </h2>
          <p className="mb-4 leading-relaxed">
            If you have any questions about this Privacy Policy or our data practices, please contact us at:
          </p>
          <p className="font-semibold">
            Email: <a href="mailto:YOUR_SUPPORT_EMAIL@example.com" className="text-blue-600 hover:underline">satvikmittal7@gmail.com</a>
          </p>
          <p className="mt-4 text-sm text-gray-600">
            For more information about Google&lsquo;s API Services User Data Policy, please visit their official documentation.
          </p>
          <a
            href="https://developers.google.com/terms/api-services-user-data-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-600 hover:underline mt-2 text-sm"
          >
            Google API Services User Data Policy <ExternalLink className="ml-1 h-4 w-4" />
          </a>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-400">
          <p>&copy; {currentYear} {appName}. All rights reserved.</p>
          <p className="mt-2">
            <Link href="/" className="hover:underline">Home</Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
