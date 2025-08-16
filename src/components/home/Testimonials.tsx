import Image, { StaticImageData } from "next/image";
import React from "react";
import { Container } from "@/components/home/Container";

import userOneImg from "../../../public/img/user1.jpg";
import userTwoImg from "../../../public/img/user2.jpg";
import userThreeImg from "../../../public/img/user3.jpg";

export const Testimonials = () => {
  return (
    <Container>
      <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <div className="lg:col-span-2 xl:col-auto">
          <div className="flex flex-col justify-between w-full h-full bg-white shadow-lg px-8 py-10 rounded-2xl dark:bg-trueGray-800 border border-gray-100 dark:border-gray-700">
            <div>
              <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
              </div>
              <p className="text-xl leading-normal mb-6 text-gray-700 dark:text-gray-300">
                &quot;CodeAnalyzer has completely transformed our development workflow. The <Mark>automated code reviews</Mark> have caught critical issues that would have made it to production otherwise.&quot;
              </p>
            </div>

            <Avatar
              image={userOneImg}
              name="Sarah Steiner"
              title="VP Engineering at Dataflow"
            />
          </div>
        </div>
        <div>
          <div className="flex flex-col justify-between w-full h-full bg-white shadow-lg px-8 py-10 rounded-2xl dark:bg-trueGray-800 border border-gray-100 dark:border-gray-700">
            <div>
              <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
              </div>
              <p className="text-xl leading-normal mb-6 text-gray-700 dark:text-gray-300">
                &quot;The <Mark>security vulnerability</Mark> detection has been invaluable for our team. We&apos;ve reduced our security incidents by 78% since implementing CodeAnalyzer.&quot;
              </p>
            </div>

            <Avatar
              image={userTwoImg}
              name="Dylan Ambrose"
              title="CTO at TechStream"
            />
          </div>
        </div>
        <div>
          <div className="flex flex-col justify-between w-full h-full bg-white shadow-lg px-8 py-10 rounded-2xl dark:bg-trueGray-800 border border-gray-100 dark:border-gray-700">
            <div>
              <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
              </div>
              <p className="text-xl leading-normal mb-6 text-gray-700 dark:text-gray-300">
                &quot;Our team&apos;s productivity has increased by 40% since we started using CodeAnalyzer. The <Mark>AI-powered</Mark> suggestions are like having an expert reviewer available 24/7.&quot;
              </p>
            </div>

            <Avatar
              image={userThreeImg}
              name="Gabrielle Winn"
              title="Lead Developer at Acme Inc"
            />
          </div>
        </div>
      </div>
    </Container>
  );
};

interface AvatarProps {
  image: StaticImageData;
  name: string;
  title: string;
}

function Avatar(props: Readonly<AvatarProps>) {
  return (
    <div className="flex items-center mt-6 space-x-3">
      <div className="flex-shrink-0 overflow-hidden rounded-full w-12 h-12 border-2 border-indigo-100 dark:border-indigo-800">
        <Image
          src={props.image}
          width="48"
          height="48"
          alt={`Avatar of ${props.name}`}
          placeholder="blur"
          className="object-cover"
        />
      </div>
      <div>
        <div className="text-base font-semibold text-gray-800 dark:text-white">{props.name}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">{props.title}</div>
      </div>
    </div>
  );
}

function Mark(props: { readonly children: React.ReactNode }) {
  return (
    <>
      {" "}
      <mark className="text-indigo-800 bg-indigo-100 rounded-md px-1 py-0.5 dark:bg-indigo-900 dark:text-indigo-200">
        {props.children}
      </mark>{" "}
    </>
  );
}
