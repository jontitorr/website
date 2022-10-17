import Head from "next/head";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { Text, Image } from "@nextui-org/react";
import NextLink from "next/link";
import { useEffect, useRef } from "react";
import Layout from "@/components/Layout";
import Typed from "typed.js";
import { logger } from "@/lib/logger";

import styles from "./index.module.css";

const projects = [
  {
    href: "https://github.com/xminent/ekisocket",
    label: "Ekisocket",
    description: "A small network library written for use with my library Ekizu.",
    github: true,
  },
  {
    href: "https://github.com/xminent/ekizu",
    label: "Ekizu",
    description:
      "A Discord API wrapper written in C++ for use in creating Discord applications. It is very similar to Discord.js, as it was my library of choice for making my Discord bots.",
    github: true,
  },
  {
    href: "https://github.com/xminent/eventemitter",
    label: "EventEmitter",
    description:
      "An Node.js EventEmitter implementation written in C++. It is a runtime emitter which can accept different types of events and emit them, without multiple instantiated emitters.",
    github: true,
  },
  {
    href: "https://github.com/xminent/king",
    label: "King",
    description:
      "A Discord bot written in Typescript using Discord.js. This bot is filled with a lot of features including a custom command system with Slash Commands supported, a music bot, moderation bot, and many more fun commands and features which are made possible due to the multiple APIs being used.",
    github: true,
  },
  {
    href: "/",
    label: "This website 😲",
    description:
      'This website was made using Next.js, NextUI, TailwindCSS, and many more technologies. By incorporating multiple features such as Authentication, Page Routing, and a rate-limited API, I was able to create a website that seems professional. In addition, this application was designed to serve multiple subdomains, which can allow me to serve multiple websites on a single domain. You can find my blog using the subdomain "blog".',
    github: false,
  },
];

const webFrameworks = ["React", "Next.js", "Svelte", "Nuxt.js", "Vue.js", "Sapper", "SvelteKit"];
const programmingLanguages = ["C++", "Typescript", "Javascript", "Python", "Rust", "C#"];

const titles = [
  "I'm a software developer.",
  "I'm a web developer.",
  "I make Discord bots.",
  "I'm a graphic designer.",
  ...programmingLanguages.map((language) => `I'm a ${language} developer.`),
  ...webFrameworks.map((framework) => `I use ${framework}.`),
];

export default function Home() {
  const titleRef = useRef<HTMLElement>(null);
  const typedRef = useRef({} as Typed);

  useEffect(() => {
    logger.debug("Home page mounted.");
  }, []);

  useEffect(() => {
    if (!titleRef.current) {
      return;
    }

    typedRef.current = new Typed(titleRef.current, {
      strings: titles,
      typeSpeed: 50,
      backSpeed: 50,
      backDelay: 1000,
      loop: true,
      showCursor: false,
    });

    return () => {
      typedRef.current.destroy();
    };
  }, [titleRef]);

  const projectList = () => {
    const ret = [];
    for (const project of projects) {
      ret.push(
        <div className="flex flex-col items-center p-3 md:flex-row">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center flex-col md:flex-row">
              <a className="hover:text-cyan-400" href={project.href}>
                <div className="text-xl font-semibold">{project.label}</div>
              </a>

              {project.github && (
                <a className="text-white" href={project.href} aria-label={`See more about ${project.label} on GitHub`}>
                  <FontAwesomeIcon className="mt-4 md:mt-0" icon={faGithub} size={"2xl"} />
                </a>
              )}
            </div>
            <p className="mt-3 text-center md:text-left">{project.description}</p>
          </div>
        </div>
      );
    }
    return ret;
  };

  return (
    <>
      <Head>
        <title>Xminent | Fullstack Developer</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <div className={`${styles.section}`}>
          <div className="container mx-auto px-4">
            <div className={`${styles["banner-box"]} flex relative flex-wrap md:items-center justify-center`}>
              <div className={`${styles["profile-pic"]}`}>
                <Image src="https://avatars.githubusercontent.com/u/59069386?v=4" alt="Avatar" />
              </div>
              <div className={`${styles.content} flex flex-wrap items-center md:w-4/12 mx-auto md:ml-16`}>
                <div className={`${styles.box} mb-5 md:mb-0`}>
                  <p className={`${styles.smTitle} text-center md:text-left`}>Hi my name is Xminent! 👋</p>
                  <Text
                    h1
                    size={60}
                    css={{
                      textGradient: "45deg, $yellow600 -20%, $red600 100%",
                    }}
                    weight="bold"
                    ref={titleRef}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={`${styles.section} ${styles.about}`}>
          <div className="container mx-auto px-4">
            <Text h1>About</Text>
            <div className="flex flex-wrap">
              <div className={`${styles["text-box"]} flex relative mb-0 md:mb-16`}>
                <p className={styles.text}>
                  Hi I&apos;m Xminent — a self taught &amp; self taught programmer from Chicago. I initially started
                  learning to code out of boredom, but now I do a mix of everything from programming things such as
                  Discord bots to making scripts that improve my daily life. I feel like I&apos;ve learned so much
                  throughout my time coding and I&apos;ve only just started, but I&apos;m excited to see what I can do
                  for the community.
                </p>
              </div>
            </div>
            <div className="md:mt-0 mb-16 md:mb-24">
              <p className={styles["about-title"]}>What I do?</p>
              <div className="md:flex md:justify-between md:items-center">
                <div className={styles.item}>
                  <div className="flex flex-wrap mb-8 md:mb-9">
                    <div className={styles.icons}>
                      <div className={styles["image-wrapper"]}>
                        <Image src="/images/python.svg" alt="python" width={40} height={40} />
                      </div>
                    </div>
                    <div className={styles.icons}>
                      <div className={styles["image-wrapper"]}>
                        <Image src="/images/cpp.svg" alt="c++" width={40} height={40} />
                      </div>
                    </div>
                    <div className={styles.icons}>
                      <div className={styles["image-wrapper"]}>
                        <Image src="/images/typescript.svg" alt="typescript" width={40} height={40} />
                      </div>
                    </div>
                  </div>
                  <div className={styles.list}>
                    <div className={styles.title}>Back-End</div>
                    <p className={styles.listItem}>Efficient Development</p>
                    <p className={styles.listItem}>Minimal Errors</p>
                    <p className={styles.listItem}>Statically Typed</p>
                    <p className={styles.listItem}>Built For Web</p>
                  </div>
                </div>
                <div className={styles.item}>
                  <div className="flex flex-wrap mb-8 md:mb-9">
                    <div className={styles.icons}>
                      <div className={styles["image-wrapper"]}>
                        <Image src="/images/svelte.svg" alt="svelte" width={40} height={40} />
                      </div>
                    </div>
                    <div className={styles.icons}>
                      <div className={styles["image-wrapper"]}>
                        <Image src="/images/tailwindcss.svg" alt="tailwindcss" width={40} height={40} />
                      </div>
                    </div>
                    <div className={styles.icons}>
                      <div className={styles["image-wrapper"]}>
                        <Image src="/images/react.svg" alt="react" width={40} height={40} />
                      </div>
                    </div>
                  </div>
                  <div className={styles.list}>
                    <div className={styles.title}>Front-End</div>
                    <p className={styles.listItem}>Component Based Design</p>
                    <p className={styles.listItem}>Smooth Animations</p>
                    <p className={styles.listItem}>Beautiful Styling</p>
                    <p className={styles.listItem}>Lightweight</p>
                  </div>
                </div>
                <div className={styles.item}>
                  <div className="flex flex-wrap mb-8 md:mb-9">
                    <div className={styles.icons}>
                      <div className={styles["image-wrapper"]}>
                        <Image src="/images/mongodb.svg" alt="mongodb" width={40} height={40} />
                      </div>
                    </div>
                    <div className={styles.icons}>
                      <div className={styles["image-wrapper"]}>
                        <Image src="/images/mysql.svg" alt="mysql" width={40} height={40} />
                      </div>
                    </div>
                    <div className={styles.icons}>
                      <div className={styles["image-wrapper"]}>
                        <Image src="/images/sqlalchemy.svg" alt="sqlalchemy" width={40} height={40} />
                      </div>
                    </div>
                  </div>
                  <div className={styles.list}>
                    <div className={styles.title}>Database</div>
                    <p className={styles.listItem}>Scalability</p>
                    <p className={styles.listItem}>Persistent Storage</p>
                    <p className={styles.listItem}>Sharding</p>
                    <p className={styles.listItem}>Reliability</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={`${styles.section} ${styles.experience}`}>
          <div className="container mx-auto px-4">
            <Text h1>Experience</Text>
            <div className="flex flex-wrap">
              <div className={`${styles["text-box"]} flex relative mb-0 md:mb-16`}>
                <p className="font-mono md:text-lg">
                  Ever since I was young I was fascinated with computers. I would spend time as a kid playing with each
                  program and wondering how they work. Upon building my first computer, I had been even more fascinated
                  with the thought of computer hardware and software. I went on to teach myself how to program with
                  Python, which then branched into a plethora of experiences with many different languages, creating
                  many projects which are near and dear to my heart.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className={`${styles.section} ${styles.projects}`}>
          <div className="container mx-auto px-4">
            <Text h1>Projects</Text>
            <div className="flex flex-wrap  mb-8">
              <div className={`${styles["text-box"]} flex relative`}>
                <p className="font-mono md:text-lg">
                  I have worked on a number of projects, ranging from personal projects to work-related projects. Here
                  are a few:
                </p>
              </div>
            </div>
            <ul className="list-disc">
              {projectList().map((p, index) => {
                return <li key={index}>{p}</li>;
              })}
              <li>
                <div className="flex flex-col items-center gap-x-8 rounded-md p-3 md:flex-row">
                  <p>
                    And many more projects which can be found on my{" "}
                    <NextLink href="https://github.com/xminent">GitHub</NextLink>
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </Layout>
    </>
  );
}
