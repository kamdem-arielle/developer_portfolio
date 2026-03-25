import React from 'react';
export function Footer() {
  return (
    <footer className="py-8 text-center border-t border-primary-dark/30">
      <p className="text-slate text-sm font-medium">
        Designed & Built with <span className="text-accent-pink">♥</span> by
        Arielle
      </p>
      <p className="text-slate/60 text-xs mt-2 font-mono">
        {/* © {new Date().getFullYear()} All Rights Reserved */}
        © 2023 All Rights Reserved
      </p>
    </footer>);

}