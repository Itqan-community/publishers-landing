'use client';

import React, { useState } from 'react';
import { FiCheck, FiChevronUp, FiChevronDown } from 'react-icons/fi';
import { ArabicFlagIcon } from './ArabicFlagIcon';

/* ─── DGA (Digital Government Authority) gradient icon ─── */
const DgaIcon = () => (
  <svg viewBox="0 0 21 31" width="18" height="26" fill="currentColor" className="flex-shrink-0">
    <g>
      <path fill="url(#dga-a)" d="M11.35 15.02a.62.62 0 0 0-.25.5v5.01a.6.6 0 1 0 1.22 0v-4.7l5.33-3.74c.18.1.38.14.6.14a1.31 1.31 0 1 0 0-2.63 1.31 1.31 0 0 0-1.3 1.47l-5.6 3.95Z" />
      <path fill="url(#dga-b)" d="M7.58 13.69v5a1.31 1.31 0 1 0 1.92 1.16c0-.5-.28-.94-.7-1.16v-4.68l7.89-5.51c.15-.11.25-.3.25-.5V4.27a.6.6 0 0 0-.6-.6.6.6 0 0 0-.62.6v3.4L7.83 13.2a.52.52 0 0 0-.25.5Z" />
      <path fill="url(#dga-c)" d="m17.03 15.36-2.01 1.41a.6.6 0 0 0-.14.85.6.6 0 0 0 .5.25c.12 0 .23-.02.34-.1l2.01-1.42a.6.6 0 0 0 .14-.85.6.6 0 0 0-.84-.14Z" />
      <path fill="url(#dga-d)" d="M20.87 18.9a.62.62 0 0 0-.86-.15l-9.52 6.66-9.51-6.66a.62.62 0 0 0-.87.16c-.2.28-.12.66.16.86l9.15 6.4-2.68 1.89a1.33 1.33 0 1 0 .72 1.19v-.18l3.05-2.13 3.05 2.13-.01.17a1.33 1.33 0 1 0 1.33-1.32c-.23 0-.43.05-.61.14l-2.67-1.88 9.14-6.41c.26-.2.33-.58.13-.86Z" />
      <path fill="url(#dga-e)" d="m3.96 4.47 2-1.42a.6.6 0 0 0 .15-.84.6.6 0 0 0-.5-.26.56.56 0 0 0-.35.11l-2 1.42a.6.6 0 0 0-.15.85.6.6 0 0 0 .85.14Z" />
      <path fill="url(#dga-f)" d="M12.19 2.47v3.36l-7.9 5.51a.62.62 0 0 0-.25.5v3.73c0 .34.27.6.61.6a.6.6 0 0 0 .61-.6v-3.4l7.9-5.52c.15-.12.25-.3.25-.5V2.47c.42-.22.7-.65.7-1.15a1.31 1.31 0 1 0-2.63 0c.02.49.3.93.7 1.15Z" />
      <path fill="url(#dga-g)" d="M2.71 10.2c.73 0 1.32-.58 1.32-1.32l-.01-.15 5.6-3.92c.15-.12.25-.3.25-.5V.62a.6.6 0 0 0-.6-.6.6.6 0 0 0-.62.6V4L3.32 7.72a1.2 1.2 0 0 0-.6-.14 1.31 1.31 0 1 0-.01 2.62Z" />
      <defs>
        <linearGradient id="dga-a" x1="15.34" x2="15.34" y1="3.96" y2="27.77" gradientUnits="userSpaceOnUse"><stop stopColor="#00ABAF" /><stop offset=".24" stopColor="#0093B4" /><stop offset=".48" stopColor="#0080BA" /><stop offset="1" stopColor="#774896" /></linearGradient>
        <linearGradient id="dga-b" x1="11.91" x2="11.91" y1="3.96" y2="27.77" gradientUnits="userSpaceOnUse"><stop stopColor="#00ABAF" /><stop offset=".24" stopColor="#0093B4" /><stop offset=".48" stopColor="#0080BA" /><stop offset="1" stopColor="#774896" /></linearGradient>
        <linearGradient id="dga-c" x1="16.37" x2="16.37" y1="3.96" y2="27.77" gradientUnits="userSpaceOnUse"><stop stopColor="#00ABAF" /><stop offset=".24" stopColor="#0093B4" /><stop offset=".48" stopColor="#0080BA" /><stop offset="1" stopColor="#774896" /></linearGradient>
        <linearGradient id="dga-d" x1="10.49" x2="10.49" y1="3.96" y2="27.77" gradientUnits="userSpaceOnUse"><stop stopColor="#29B2B2" /><stop offset=".27" stopColor="#1091B3" /><stop offset=".48" stopColor="#017EB5" /><stop offset="1" stopColor="#704B98" /></linearGradient>
        <linearGradient id="dga-e" x1="4.61" x2="4.61" y1="3.96" y2="27.77" gradientUnits="userSpaceOnUse"><stop stopColor="#00ABAF" /><stop offset=".24" stopColor="#0093B4" /><stop offset=".48" stopColor="#0080BA" /><stop offset="1" stopColor="#774896" /></linearGradient>
        <linearGradient id="dga-f" x1="9.08" x2="9.08" y1="3.96" y2="27.77" gradientUnits="userSpaceOnUse"><stop stopColor="#00ABAF" /><stop offset=".24" stopColor="#0093B4" /><stop offset=".48" stopColor="#0080BA" /><stop offset="1" stopColor="#774896" /></linearGradient>
        <linearGradient id="dga-g" x1="5.64" x2="5.64" y1="3.96" y2="27.77" gradientUnits="userSpaceOnUse"><stop stopColor="#00ABAF" /><stop offset=".24" stopColor="#0093B4" /><stop offset=".48" stopColor="#0080BA" /><stop offset="1" stopColor="#774896" /></linearGradient>
      </defs>
    </g>
  </svg>
);

export const GovernmentBanner: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full bg-white border-b border-[#ebe8e8] font-primary antialiased" dir="rtl">
      {/* Main bar: padding on this block only so divider below can be full width */}
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-12 xl:px-20 py-2">
        <div className="flex items-center gap-md py-sm text-xs">
          <ArabicFlagIcon />
          <span className="text-[#555] font-medium">
            موقع حكومي مسجل لدى هيئة الحكومة الرقمية
          </span>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1 text-[var(--color-gov-link)] hover:opacity-80 transition-opacity font-medium"
          >
            <FiCheck size={14} />
            <span>كيف تتحقق؟</span>
            {isOpen ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* Collapsible: full width (no padding on this wrapper) so dividers span edge to edge */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out w-full ${isOpen
          ? 'max-h-[400px] opacity-100'
          : 'max-h-0 opacity-0'
          }`}
      >
        {/* Full-width divider under first row (main bar) */}
        <div className="w-full border-t border-[#ebe8e8]" aria-hidden />

        {/* Two columns: padding on inner content only */}
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-12 xl:px-20 py-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-6">
            {/* Col 1: .gov.sa */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-[52px] h-[52px] flex items-center justify-center" aria-hidden>
                <img src="/link-icon.png" alt="" className="size-6xl object-contain" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-bold text-[#161616] text-xs sm:text-sm">
                  روابط المواقع الالكترونية الرسمية السعودية تنتهي ب
                  <span className="text-[var(--color-gov-link)]"> gov.sa </span>
                </span>
                <span className="text-xs text-[#6a6a6a]">
                  جميع روابط المواقع الرسمية التابعة للجهات الحكومية في المملكة العربية السعودية تنتهي بـ
                  <span className="mx-1">gov.sa</span>
                </span>
              </div>
            </div>

            {/* Col 2: HTTPS */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-[52px] h-[52px] flex items-center justify-center" aria-hidden>
                <img src="/lock-icon.png" alt="" className="size-6xl object-contain" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-bold text-[#161616] text-xs sm:text-sm">
                  المواقع الالكترونية الحكومية تستخدم بروتوكول
                  <span className="text-[var(--color-gov-link)]"> HTTPS للتشفير و الأمان. </span>
                </span>
                <span className="text-xs text-[#6a6a6a]">
                  المواقع الالكترونية الآمنة في المملكة العربية السعودية تستخدم بروتوكول HTTPS للتشفير.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Full-width divider above footer */}
        <div className="w-full border-t border-[#ebe8e8]" aria-hidden />

        {/* Footer: DGA registration — align start, slightly bigger/bolder */}
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-12 xl:px-20 pt-4 pb-5 flex items-center justify-start gap-3 flex-wrap">
          <DgaIcon />
          <span className="text-sm text-[#555] font-semibold">مسجل لدى هيئة الحكومة الرقمية برقم:</span>
          <a
            href="https://raqmi.dga.gov.sa/platforms/platforms/5b6415e9-ab75-44ba-b359-a2148b1ec8bc/platform-license"
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="text-[var(--color-gov-link)] hover:underline font-bold"
            aria-label="رابط شهادة التسجيل"
          >
            {/* Number left empty as requested */}
          </a>
        </div>
      </div>
    </div>
  );
};
