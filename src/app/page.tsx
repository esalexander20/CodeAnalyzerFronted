import { Container } from "@/components/home/Container";
import { Hero } from "@/components/home/Hero";
import { SectionTitle } from "@/components/home/SectionTitle";
import { Benefits } from "@/components/home/Benefits";
import { Video } from "@/components/home/Video";
import { Testimonials } from "@/components/home/Testimonials";
import { Faq } from "@/components/home/Faq";
import { Cta } from "@/components/home/Cta";

import { benefitOne, benefitTwo } from "@/components/home/data";
export default function Home() {
  return (
    <Container>
      <Hero />
      <SectionTitle
        preTitle="CodeAnalyzer Benefits"
        title="Elevate Your Code Quality"
      >
        Our AI-powered platform provides instant, in-depth code analysis for GitHub repositories, 
        helping developers write cleaner, more efficient, and secure code with every commit.
      </SectionTitle>

      <Benefits data={benefitOne} />
      <Benefits imgPos="right" data={benefitTwo} />

      <SectionTitle
        preTitle="See it in action"
        title="How CodeAnalyzer works"
      >
        Watch how CodeAnalyzer transforms your development workflow with instant,
        AI-powered code analysis. See how easily you can improve code quality,
        catch bugs early, and enforce best practices across your entire codebase.
      </SectionTitle>

      <Video videoId="fZ0D0cnR88E" />

      <SectionTitle
        preTitle="Developer Testimonials"
        title="Trusted by Top Engineering Teams"
      >
        Join thousands of developers and engineering teams who rely on CodeAnalyzer 
        to maintain high code quality and ship better software faster.
      </SectionTitle>

      <Testimonials />

      <SectionTitle preTitle="FAQ" title="Common Questions">
        Everything you need to know about how CodeAnalyzer can transform your development workflow.
        Can&apos;t find the answer you&apos;re looking for? Reach out to our support team.
      </SectionTitle>

      <Faq />
      <Cta />
    </Container>
  );
}
