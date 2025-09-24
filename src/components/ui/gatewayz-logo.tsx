import React from 'react';
import Image from 'next/image';

interface GatewayzLogoProps {
  className?: string;
  size?: number;
}

export function GatewayzLogo({ className = "", size = 24 }: GatewayzLogoProps) {
  return (
    <Image
      src="/logo.png"
      alt="Gatewayz Logo"
      width={size}
      height={size}
      className={className}
      priority
    />
  );
}

export default GatewayzLogo;
