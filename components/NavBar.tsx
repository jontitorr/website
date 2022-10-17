import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { Button, Loading, Modal, Navbar, Text, useTheme, Dropdown } from "@nextui-org/react";
import { useCurrentUser } from "@/lib/user";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faUser } from "@fortawesome/free-solid-svg-icons";
import ThemeToggle from "./ThemeToggle";
import { dev, subdomains } from "@/lib/config";
import toast, { Toaster } from "react-hot-toast";
import { useApp } from "./App";
import NextLink from "next/link";
import Input from "./Input";
import NextImage from "next/image";
import NextUILink from "./NextUILink";

import "react-slidedown/lib/slidedown.css";

import type { Link as NavLink } from "./App";
import type { FormElement } from "@nextui-org/react";
import type { WaifuSearchResult } from "@/types/waifu";
import { logger } from "@/lib/logger";

// This error prop will contain a toggle field, so that even if the ACTUAL contained value is the same, our object will be different, thus allowing useEffect to trigger.
export interface NavBarError {
  message: string;
  toggle: boolean;
}

interface NavBarProps {
  error: NavBarError;
  links: NavLink[];
}

export const scrollTo = (className: string) => {
  const element = document.querySelector(`.${className}`);
  element && element.scrollIntoView({ behavior: "smooth" });
};

export default function NavBar({ error, links }: NavBarProps) {
  const [host, setHost] = useState<string>("");
  const [inputFocused, setInputFocused] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showResults, setShowResults] = useState(true);
  const [waifusLoading, setWaifusLoading] = useState(false);
  const [waifus, setWaifus] = useState<WaifuSearchResult[]>([]);

  const { setError } = useApp();
  const { data: { user } = {}, mutate } = useCurrentUser();
  const { isDark } = useTheme();
  const router = useRouter();
  const navBarToggleRef = useRef<HTMLButtonElement>(null);

  const baseLinks: NavLink[] = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Blog",
      href: "/",
      subdomain: "blog",
    },
    {
      label: "Résumé",
      href: "/api/files/resume",
    },
  ];

  const loggedInLinks: NavLink[] = [
    {
      label: "Browse",
      href: "/waifus/browse",
    },
    {
      label: "Logout",
      callback: () => {
        setLogoutModalVisible(true);
      },
      component: () => {
        return (
          <Modal
            closeButton
            preventClose
            aria-labelledby="modal-title"
            open={logoutModalVisible}
            onClose={logoutModalCloseHandler}
            css={{ backgroundColor: isDark ? "#000000" : "#fff", border: isDark ? "1px solid #fff" : "1px solid #000" }}
          >
            <Modal.Body>
              <Text id="modal-description">Are you sure you want to logout?</Text>
            </Modal.Body>
            <Modal.Footer>
              <Button
                auto
                flat
                color="error"
                onPress={() => {
                  fetch("/api/auth", {
                    mode: "cors",
                    method: "DELETE",
                  }).then(() => {
                    mutate({ user: null });
                  });
                  setLogoutModalVisible(false);
                }}
              >
                Log Out
              </Button>
              <Button auto onPress={() => setLogoutModalVisible(false)}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        );
      },
    },
  ];

  const loggedOutLinks: NavLink[] = [
    {
      label: "Login",
      href: "/login",
      root: true,
    },
    {
      label: "Sign Up",
      href: "/signup",
      root: true,
    },
  ];

  const setNavbarToggle = (state: boolean) => {
    if (!navBarToggleRef.current) {
      return;
    }

    const currentState = navBarToggleRef.current.getAttribute("aria-pressed") === "true";

    if (currentState !== state) {
      navBarToggleRef.current.click();
    }
  };

  useEffect(() => {
    setHost(window.location.host);

    const onWindowResize = () => {
      const { innerWidth: width } = window;
      width >= 960 && setNavbarToggle(false);
    };

    window.addEventListener("resize", onWindowResize);

    setMounted(true);
    logger.debug("NavBar mounted");

    return () => {
      window.removeEventListener("resize", onWindowResize);
    };
  }, []);

  useEffect(() => {
    error.message &&
      toast.error(error.message, {
        duration: 2000,
        position: "top-center",

        style: {
          background: isDark ? "#1e1e1e" : "#fff",
          color: isDark ? "#fff" : "#000",
        },

        ariaProps: {
          role: "alert",
          "aria-live": "assertive",
        },
      });
  }, [error, isDark]);

  useEffect(() => {
    setNavbarToggle(false);
  }, [router.asPath]);

  const livesearch = async (text: string) => {
    const res = await fetch("/api/waifus/livesearch", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
      }),
    });

    if (res.status === 200) {
      const data = await res.json();
      setWaifus([...data]);
    } else {
      const { message, redirect } = await res.json();

      if (message) {
        setError(message);
      }
      if (redirect) {
        router.push(redirect);
      }
    }

    setWaifusLoading(false);
  };

  const doneTyping = (e: React.KeyboardEvent<FormElement>) => {
    const { value } = e.target as FormElement;

    if (!value.length) {
      return;
    }

    setWaifusLoading(true);
    livesearch(value);
  };

  const typingLivesearch = () => {
    if (waifus.length) {
      setWaifus([]);
    }
  };

  const onInputFocus = () => {
    setInputFocused(true);
  };

  const checkLiveInput = (e: React.FormEvent<FormElement>) => {
    const { value } = e.target as FormElement;
    if (!inputFocused) {
      return;
    }
    if (value.trim() === "") {
      setWaifus([]);
    }
  };

  const logoutModalCloseHandler = () => {
    setLogoutModalVisible(false);
  };

  const navBarLink = (link: NavLink) => {
    const { label, href, subdomain, callback, component, root } = link;

    let linkHref = href;

    if (href) {
      if (subdomain) {
        linkHref = dev ? `http://${subdomain}.localhost:3000${href}` : `https://${subdomain}.${host}${href}`;
      } else {
        linkHref = href;
      }

      if (root) {
        const index = subdomains.findIndex((subdomain) => host.startsWith(subdomain));

        if (index !== -1) {
          const toRemove = `${subdomains[index]}.`;

          linkHref = `https://${host.replace(toRemove, "")}${href}`;
        }
      }
    }

    return (
      <NextUILink
        href={linkHref || "#"}
        onClick={(e) => {
          !linkHref && e.preventDefault();
          callback && callback();
        }}
        css={{ color: isDark ? "#fff" : "#000" }}
      >
        {label}
        {component && component()}
      </NextUILink>
    );
  };

  const navLinks = (desktop: boolean) => {
    const linksToRender = [...links, ...baseLinks, ...(user ? loggedInLinks : loggedOutLinks)];
    return (
      <>
        {linksToRender
          .filter((link) => !link.subdomain || (link.subdomain && !host.startsWith(link.subdomain)))
          .map((link, i) => {
            return desktop ? (
              <Navbar.Item key={i}>{navBarLink(link)}</Navbar.Item>
            ) : (
              <Navbar.CollapseItem key={i}>{navBarLink(link)}</Navbar.CollapseItem>
            );
          })}
      </>
    );
  };

  const navWaifuInput = (desktop: boolean) => {
    const navBarInput = () => (
      <Input
        clearable
        underlined
        color="warning"
        contentLeft={<FontAwesomeIcon icon={faSearch} />}
        contentLeftStyling={false}
        aria-label="Search for a waifu"
        startedTyping={() => {
          typingLivesearch();
        }}
        stoppedTyping={doneTyping}
        onInput={(e) => {
          checkLiveInput(e);
        }}
        onFocus={onInputFocus}
        onBlur={() => setInputFocused(false)}
        type="text"
        placeholder="Search for waifus"
        contentRight={waifusLoading && <Loading size="xs" />}
      />
    );

    const navBarInputResults = () => {
      const randomColor = () => {
        const letters = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      };

      return (
        showResults &&
        !waifusLoading &&
        waifus.length > 0 && (
          <Dropdown>
            <Dropdown.Button flat>Results Found!</Dropdown.Button>
            <Dropdown.Menu aria-label="Waifu Results">
              {waifus.map((waifu, i) => (
                <Dropdown.Item
                  key={i}
                  description={waifu.series.name}
                  icon={<FontAwesomeIcon icon={faUser} style={{ color: randomColor() }} />}
                  textValue={waifu.name}
                >
                  <NextLink href={`${host}${waifu.endpoint}`}>{waifu.name}</NextLink>
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        )
      );
    };

    return (
      <>
        {desktop ? (
          <>
            <Navbar.Item>{navBarInput()}</Navbar.Item>
            <Navbar.Item>
              <>{navBarInputResults()}</>
            </Navbar.Item>
            <Navbar.Item>
              <ThemeToggle />
            </Navbar.Item>
          </>
        ) : (
          <>
            <Navbar.CollapseItem>{navBarInput()}</Navbar.CollapseItem>
            <Navbar.CollapseItem>{<>{navBarInputResults()}</>}</Navbar.CollapseItem>
            <Navbar.CollapseItem>
              <ThemeToggle />
            </Navbar.CollapseItem>
          </>
        )}
      </>
    );
  };

  if (!mounted) {
    return null;
  }

  return (
    <>
      <Toaster />
      <Navbar
        shouldHideOnScroll
        isBordered
        variant="sticky"
        maxWidth="lg"
        onScrollPositionChange={(pos) => {
          pos > scrollPosition ? setShowResults(false) : setShowResults(true);
          setScrollPosition(pos);
        }}
        css={{
          jc: "space-evenly",
        }}
      >
        <Navbar.Brand>
          <Navbar.Toggle aria-label="Toggle navigation" showIn="sm" ref={navBarToggleRef} />
          <Button
            light
            size={"sm"}
            animated={false}
            onPress={() => {
              router.push("/");
            }}
            css={{ width: "44px", p: 0, minWidth: "44px" }}
          >
            <NextImage src="/logo.svg" alt="Xminent" layout="fill" />
          </Button>
          <Text b color="inherit" hideIn="xs">
            Xminent
          </Text>
        </Navbar.Brand>
        <Navbar.Content enableCursorHighlight hideIn="sm">
          {navLinks(true)}
        </Navbar.Content>
        <Navbar.Content hideIn="sm">{navWaifuInput(true)}</Navbar.Content>
        <Navbar.Collapse id="collapse">
          {navLinks(false)}
          {navWaifuInput(false)}
        </Navbar.Collapse>
      </Navbar>
    </>
  );
}
