import BaseModal from "@/components/reusable/base-modal";
import { useAuth } from "@/contexts/auth-context";
import { useIsMobile } from "@/hooks/use-mobile";
import { OnlyShowIf } from "@/lib/environment";
import { cn } from "@/lib/utils";
import { SignupForm } from "@/pages/auth/sign-up/signup-form";
// import { VendorSignupForm } from '@/pages/auth/sign-up/vendor-signup-form'
import {
  CreatorLogo,
  UserLoginForm,
} from "@/pages/auth/user-login/user-login-form";
import { RoleSelection } from "./role-selection";
import { ForgotPasswordView } from "./forgot-password-modal";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FaYoutube } from "react-icons/fa6";
import { Link } from "react-router";

export function AuthModal() {
  const {
    isAuthModalOpen,
    authType,
    signupType,
    closeAuthModal,
    switchAuthType,
    loginType,
    switchToSignup,
    showAuthVideo,
  } = useAuth();
  const isMobile = useIsMobile();
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Check if we are on the fans page — fans get a different signup experience
  const isFansPage =
    window.location.pathname === "/fans" ||
    window.location.pathname.startsWith("/fans/");

  const renderSignupForm = () => {
    // On /fans, skip role selection and go straight to fan signup form
    if (signupType === "guest" && authType === "signup" && !isFansPage) {
      return <RoleSelection onContinue={(role) => switchToSignup(role)} />;
    }

    switch (signupType) {
      case "creator":
        return (
          <SignupForm
            onSwitchToLogin={() => switchAuthType("login")}
            type="Organizer"
          />
        );
      case "vendor":
        return (
          <SignupForm
            onSwitchToLogin={() => switchAuthType("login")}
            type="Vendor"
          />
        );
      default:
        return (
          <SignupForm
            onSwitchToLogin={() => switchAuthType("login")}
            type="User"
          />
        );
    }
  };


  const [keepVideoPanel, setKeepVideoPanel] = useState(false);
  useEffect(() => {
    if (isAuthModalOpen) setKeepVideoPanel(showAuthVideo);
  }, [isAuthModalOpen, showAuthVideo]);

  // The video panel is opt-in per entry point (the fans sidebar and fans header sets it) and is
  // desktop-only — organizer/vendor login and checkout get the plain modal.
  const showVideoPanel = keepVideoPanel && !isMobile && !showForgotPassword;

  const getModalSize = () => {
    if (showVideoPanel) return "full";
    if (authType === "login") return "small";
    if (signupType === "creator" || signupType === "vendor") return "large";
    // Role selection modal should be large, but NOT on fans page (fans get small form)
    if (signupType === "guest" && authType === "signup" && !isFansPage)
      return "large";
    return "small";
  };

  const shouldShowCreatorLogo = () => {
    // Never show creator logo on the fans page
    if (isFansPage) return false;
    // Show logo for creator login or vendor login, role selection, or creator signup
    // Vendor signup has its own logo inside the form, so don't show floating logo
    if (authType === "signup" && signupType === "vendor") {
      return false;
    }
    return (
      loginType === "creator" ||
      loginType === "vendor" ||
      (authType === "signup" && signupType === "guest") || // Role selection
      (authType === "signup" && signupType === "creator")
    );
  };

  // Generate unique key for AnimatePresence based on current form state
  const formKey = showForgotPassword
    ? "forgot-password"
    : `${authType}-${signupType}`;

  function handleModalClose() {
    setShowForgotPassword(false);
    closeAuthModal();
  }

  return (
    <BaseModal
      open={isAuthModalOpen}
      onClose={handleModalClose}
      floatingCancel
      cancelClassName={cn(
        // dialog.tsx defaults a floating cancel to white-on-white/10, which is
        // built for dark video. Every branch here sits on a light surface, so
        // the dark treatment applies throughout, not just with the video.
        "bg-black/10 text-black hover:bg-black/20",
        {
          // Only the position is video-specific: over the form half, clear of
          // the video.
          "top-6 right-6 z-[60]": showVideoPanel,
        },
      )}
      className={cn({
        "inset-0 h-screen max-h-screen w-screen max-w-none translate-x-0 translate-y-0 overflow-hidden rounded-none sm:rounded-none bg-gradient-to-b from-[#F3F3F3] to-[#D9D9D9]":
          showVideoPanel,
        "bg-transparent shadow-none":
          !showForgotPassword &&
          authType === "signup" &&
          (signupType === "creator" ||
            signupType === "vendor" ||
            (signupType === "guest" && !isFansPage)),
        "bg-[#F5F5F5]":
          !showForgotPassword &&
          authType === "signup" &&
          !(
            signupType === "creator" ||
            signupType === "vendor" ||
            (signupType === "guest" && !isFansPage)
          ),
      })}
      overlayClassName="bg-[#F5F5F5] !opacity-100"
      size={getModalSize()}
    >
      <div
        className={cn("w-full", {
          // relative so the mobile video can absolutely fill it.
          "relative flex h-screen items-stretch": showVideoPanel,
        })}
      >
        <OnlyShowIf condition={showVideoPanel}>
          <AuthVideoPanel />
        </OnlyShowIf>

        <div
          className={cn({
            // z-10 lifts the form above the mobile background video.
            "relative z-10 flex w-full flex-col items-center justify-center overflow-y-auto p-4 md:w-1/2 md:p-6":
              showVideoPanel,
          })}
        >
          <div
            className={cn({
              // Mobile only: a card so the form stays readable over the video.
              "w-full max-w-md rounded-2xl p-6 shadow-2xl md:max-w-none md:rounded-none md:bg-none md:p-0 md:shadow-none":
                showVideoPanel,
            })}
          >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={formKey}
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -20 }}
              transition={{
                duration: 0.4,
                ease: [0.25, 0.1, 0.25, 1],
                layout: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
              }}
              layout
            >
              {showForgotPassword ? (
                <ForgotPasswordView
                  onBack={() => setShowForgotPassword(false)}
                />
              ) : (
                <>
                  <OnlyShowIf condition={shouldShowCreatorLogo()}>
                    <motion.div
                      className="relative w-full"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                      <div className="absolute -top-16 md:-top-20 left-1/2 -translate-x-1/2 scale-[0.8] md:scale-100 origin-bottom">
                        <CreatorLogo />
                      </div>
                    </motion.div>
                  </OnlyShowIf>
                  {authType === "login" ? (
                    <UserLoginForm
                      onForgotPassword={() => setShowForgotPassword(true)}
                    />
                  ) : (
                    renderSignupForm()
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>
          </div>
        </div>
      </div>
    </BaseModal>
  );
}

/**
 * The fans auth video. Fills the screen behind the form on mobile, and becomes
 * the left half of the split from md up.
 */
function AuthVideoPanel() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Autoplay only works muted, and the attribute alone isn't always enough —
    // set the property too, then kick off play() and ignore a blocked promise.
    video.muted = true;
    video.play().catch(() => {});
  }, []);

  return (
    // Mobile: a full-bleed background layer behind the form.
    // md+: the left half of the split.
    <div className="absolute inset-0 overflow-hidden md:relative md:inset-auto md:block md:h-full md:w-1/2 md:shrink-0 md:self-stretch">
      <video
        ref={videoRef}
        src="/assets/login/login-teaser.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Scrim so the caption stays readable over any frame of the video. */}
      <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black via-black/70 to-transparent" />

      <div className="absolute inset-x-0 bottom-10 p-6 flex flex-col gap-2 items-start">
        <p className="font-inter-tight md:text-xl text-base capitalize font-semibold leading-snug text-white">
          Listen to specially curated DJ sessions on YouTube!
        </p>
        <Link
          to="https://youtube.com/@offthedecksessions?si=HMM-5ob4HRRoLmJH"
          className="inline-flex gap-2 items-center"
        >
          <FaYoutube className="w-6 h-6 text-white" />
          <span className="font-work-sans uppercase text-xl font-bold text-white">
            OffThedeckSessions
          </span>
        </Link>
      </div>
    </div>
  );
}
