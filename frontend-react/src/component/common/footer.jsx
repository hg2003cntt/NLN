import {
    Footer,
    FooterBrand,
    FooterDivider,
    FooterIcon,
    FooterLink,
    FooterLinkGroup,
    FooterTitle,
  } from "flowbite-react";
  import { BsFacebook, BsGithub, BsInstagram, BsTwitter, BsDribbble } from "react-icons/bs";
  
  export function PsychologyCareFooter() {
    return (
      <Footer container className="bg-white shadow-md rounded-lg p-6">
        <div className="w-full max-w-6xl mx-auto">
          {/* Footer Sections - Split into Two Columns */}
          <div className="flex flex-wrap sm:flex-nowrap justify-between gap-6">
            {/* Left Section - Logo and About */}
            <div className="flex-1">
              <FooterBrand
                href="#"
                src="/logo/6697109.jpg"
                alt="Psychology Care Logo"
                name="Psychology Care"
              />
              <div className="mt-4">
                <FooterTitle title="About" />
                <FooterLinkGroup col className="space-y-2">
                  <FooterLink href="#">Our Team</FooterLink>
                  <FooterLink href="#">Services</FooterLink>
                </FooterLinkGroup>
              </div>
            </div>
  
            {/* Right Section - Follow Us and Legal */}
            <div className="flex-1">
              <div className="mt-4">
                <FooterTitle title="Follow Us" />
                <FooterLinkGroup col className="space-y-2">
                  <FooterLink href="#">Github</FooterLink>
                  <FooterLink href="#">Discord</FooterLink>
                </FooterLinkGroup>
              </div>
              <div className="mt-4">
                <FooterTitle title="Legal" />
                <FooterLinkGroup col className="space-y-2">
                  <FooterLink href="#">Privacy Policy</FooterLink>
                  <FooterLink href="#">Terms & Conditions</FooterLink>
                </FooterLinkGroup>
              </div>
            </div>
          </div>
  
          {/* Divider */}
          <div className="my-6 border-t border-gray-200"></div>
  
          {/* Copyright and Social Icons Section */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-gray-500">
            <span>© 2025 Psychology Care™</span>
            <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
              <FooterIcon href="#" icon={BsFacebook} />
              <FooterIcon href="#" icon={BsInstagram} />
              <FooterIcon href="#" icon={BsTwitter} />
              <FooterIcon href="#" icon={BsGithub} />
              <FooterIcon href="#" icon={BsDribbble} />
            </div>
          </div>
        </div>
      </Footer>
    );
  }
  
  
  
  
  