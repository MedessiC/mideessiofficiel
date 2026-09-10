import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function SupportButton(): JSX.Element {
  const location = useLocation();

  // Hide button on specific pages where it would be redundant or intrusive
  const hideOnPaths = ['/contact', '/submit-dossier', '/clients', '/clients/'];
  const pathname = location.pathname || '/';
  if (hideOnPaths.some((p) => pathname === p || pathname.startsWith(p))) return null;

  return (
    <Link
      to="/contact"
      aria-label="Support MIDEESSI"
      title="Support"
      className="fixed right-4 bottom-[8.5rem] lg:right-6 lg:bottom-6 flex items-center justify-center rounded-full bg-[#FAFAFA] shadow-lg border border-[#E6E6EA] hover:scale-105 overflow-hidden motion-safe:transition-all motion-safe:duration-200"
      style={{ boxShadow: '0 6px 24px rgba(15,23,42,0.08)', zIndex: 9999 }}
    >
      <img
        src="/support.png"
        alt="Support MIDEESSI"
        className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 object-cover transform scale-110"
        style={{ borderRadius: '9999px' }}
        onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/support.webp'; }}
      />
    </Link>
  );
}
