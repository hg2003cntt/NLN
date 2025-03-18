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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Logo */}
            <div>
              <FooterBrand
                href="#"
                src="/logo/6697109.jpg"
                alt="Psychology Care Logo"
                name="Psychology Care"
              />
            </div>
  
            {/* About */}
            <div>
              <FooterTitle title="About" />
              <FooterLinkGroup col className="space-y-2">
                <FooterLink href="#">Our Team</FooterLink>
                <FooterLink href="#">Services</FooterLink>
              </FooterLinkGroup>
            </div>
  
            {/* Follow Us */}
            <div>
              <FooterTitle title="Follow Us" />
              <FooterLinkGroup col className="space-y-2">
                <FooterLink href="#">Github</FooterLink>
                <FooterLink href="#">Discord</FooterLink>
              </FooterLinkGroup>
            </div>
  
            {/* Legal */}
            <div>
              <FooterTitle title="Legal" />
              <FooterLinkGroup col className="space-y-2">
                <FooterLink href="#">Privacy Policy</FooterLink>
                <FooterLink href="#">Terms & Conditions</FooterLink>
              </FooterLinkGroup>
            </div>
          </div>
  
          {/* Divider */}
          <FooterDivider />
  
          {/* Copyright & Social Icons */}
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
  