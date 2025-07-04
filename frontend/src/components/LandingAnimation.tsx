'use client'; 

import React, { useEffect, useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';

const LandingAnimation: React.FC = () => {
  const animationContainerRef = useRef<HTMLDivElement>(null);
  const emailRefs = useRef<HTMLDivElement[]>([]);
  const cleanEmailRefs = useRef<HTMLDivElement[]>([]);
  const checkMarkRef = useRef<HTMLDivElement>(null);

  const numEmails = 50; 

  useLayoutEffect(() => {
    if (!animationContainerRef.current) return;

    emailRefs.current.forEach(email => {
      if (email) {
        const size = Math.random() * 15 + 15; 
        email.style.width = `${size}px`;
        email.style.height = `${size * 0.75}px`;
        email.style.left = `${Math.random() * 100}%`; 
        email.style.top = `${Math.random() * 100}%`;
        email.style.transform = `rotate(${Math.random() * 360}deg)`;
        email.style.opacity = '0';
      }
    });

    if (cleanEmailRefs.current[0]) {
        cleanEmailRefs.current[0].style.left = '20%';
        cleanEmailRefs.current[0].style.top = '25%';
        cleanEmailRefs.current[0].style.opacity = '0';
        cleanEmailRefs.current[0].style.transform = 'scale(0.8)';
    }
    if (cleanEmailRefs.current[1]) {
        cleanEmailRefs.current[1].style.left = '70%';
        cleanEmailRefs.current[1].style.top = '60%';
        cleanEmailRefs.current[1].style.opacity = '0';
        cleanEmailRefs.current[1].style.transform = 'scale(0.8)';
    }
    if (cleanEmailRefs.current[2]) {
        cleanEmailRefs.current[2].style.left = '45%';
        cleanEmailRefs.current[2].style.top = '75%';
        cleanEmailRefs.current[2].style.opacity = '0';
        cleanEmailRefs.current[2].style.transform = 'scale(0.8)';
    }

    if (checkMarkRef.current) {
        checkMarkRef.current.style.left = '50%';
        checkMarkRef.current.style.top = '50%';
        checkMarkRef.current.style.transform = 'translate(-50%, -50%) scale(0.5)';
        checkMarkRef.current.style.opacity = '0';
    }

  }, []); 


  useEffect(() => {
    const ctx = gsap.context(() => {
        const tl = gsap.timeline({ repeat: -1, yoyo: false, delay: 1 });
        const containerRect = animationContainerRef.current?.getBoundingClientRect();
        const centerX = containerRect ? containerRect.width / 2 : window.innerWidth / 2;
        const centerY = containerRect ? containerRect.height / 2 : window.innerHeight / 2;


        tl.to(emailRefs.current, {
            opacity: 0.7,
            scale: 1,
            duration: 1,
            stagger: {
                each: 0.05,
                from: "random"
            },
            ease: "power2.out"
        }, 0);

        tl.to(emailRefs.current, {
            x: (i, target) => centerX - target.getBoundingClientRect().left - target.getBoundingClientRect().width / 2,
            y: (i, target) => centerY - target.getBoundingClientRect().top - target.getBoundingClientRect().height / 2,
            scale: 0.2,
            opacity: 0,
            rotation: '+=360',
            duration: 1.5,
            stagger: {
                each: 0.02,
                from: "center"
            },
            ease: "power1.inOut"
        }, "+=1");

        tl.to(cleanEmailRefs.current, {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            stagger: 0.3,
            ease: "back.out(1.7)"
        }, "-=0.8");

        tl.to(checkMarkRef.current, {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            ease: "back.out(1.7)"
        }, "-=0.5");

        tl.to(checkMarkRef.current, {
            opacity: 0,
            scale: 0.5,
            duration: 0.5,
            ease: "power1.in"
        }, "+=1");

        tl.to(cleanEmailRefs.current, {
            opacity: 0,
            scale: 0.8,
            duration: 0.8,
            stagger: 0.1,
            ease: "power1.in"
        }, "-=0.3");

        tl.set(emailRefs.current, { opacity: 0, scale: 0, x: 0, y: 0, rotation: 0 });
        tl.set(cleanEmailRefs.current, { opacity: 0, scale: 0.8 });
        tl.set(checkMarkRef.current, { opacity: 0, scale: 0.5 });

    }, animationContainerRef);

    return () => ctx.revert(); 
  }, []);

  return (
    <>
      <style jsx>{`
        .email-item {
            position: absolute;
            background-color: #fca5a5; /* Light red */
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .clean-email-icon {
            position: absolute;
            width: 80px;
            height: 60px;
            background-color: #60a5fa; /* Blue */
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 30px;
            color: white;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        .clean-email-icon::before {
            content: '✉️'; /* Mail emoji */
            font-size: 30px;
        }
        .check-mark {
            position: absolute;
            font-size: 100px;
            color: #22c55e; /* Green */
        }

        /* Basic responsive adjustments for email items */
        @media (max-width: 768px) {
            .email-item {
                width: 20px;
                height: 15px;
            }
            .clean-email-icon {
                width: 60px;
                height: 45px;
                font-size: 20px;
            }
            .clean-email-icon::before {
                font-size: 20px;
            }
            .check-mark {
                font-size: 80px;
            }
        }
      `}</style>

      <div ref={animationContainerRef} className="absolute inset-0 overflow-hidden">
        {Array.from({ length: numEmails }).map((_, i) => (
          <div key={`email-${i}`} className="email-item" ref={el => { emailRefs.current[i] = el as HTMLDivElement; }}></div>
        ))}

        <div className="clean-email-icon" ref={el => {cleanEmailRefs.current[0] = el as HTMLDivElement;}}></div>
        <div className="clean-email-icon" ref={el => {cleanEmailRefs.current[1] = el as HTMLDivElement;}}></div>
        <div className="clean-email-icon" ref={el => {cleanEmailRefs.current[2] = el as HTMLDivElement;}}></div>

        <div className="check-mark" ref={checkMarkRef}></div>
      </div>
    </>
  );
};

export default LandingAnimation;
