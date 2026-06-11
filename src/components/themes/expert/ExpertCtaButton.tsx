import type { ComponentPropsWithoutRef, MouseEvent } from 'react';
import { DNA } from '../../../site/current';

interface ExpertCtaButtonProps extends ComponentPropsWithoutRef<'a'> {
  label: string;
  subLabel?: string;
  fullWidth?: boolean;
}

export function ExpertCtaButton({
  label,
  subLabel,
  fullWidth = false,
  href,
  className = '',
  onClick,
  ...props
}: ExpertCtaButtonProps) {
  const finalHref = href === '#checkout' ? DNA.checkoutUrl : href;

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
  };

  return (
    <a
      href={finalHref}
      target={finalHref?.startsWith('http') ? '_blank' : undefined}
      rel={finalHref?.startsWith('http') ? 'noopener noreferrer' : undefined}
      onClick={handleClick}
      className={`
        expert-headline relative inline-flex flex-col items-center justify-center 
        rounded-[15px] px-8 py-4 text-center text-lg font-black uppercase 
        tracking-wide text-[rgb(var(--color-cta-text))] shadow-[0_12px_40px_rgba(var(--color-cta-base),0.3)] 
        transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] 
        hover:shadow-[0_18px_50px_rgba(var(--color-cta-base),0.45)] 
        active:translate-y-0 active:scale-100
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      style={{
        backgroundColor: 'rgb(var(--color-cta-base))',
      }}
      {...props}
    >
      <div className="absolute inset-0 rounded-[15px] bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
      
      <span className="relative z-10">{label}</span>
      
      {subLabel && (
        <span className="expert-body mt-1 relative z-10 text-xs font-bold uppercase tracking-widest text-[rgb(var(--color-cta-text))]/80">
          {subLabel}
        </span>
      )}
    </a>
  );
}

export default ExpertCtaButton;
