import React from 'react';
import { FaExternalLinkAlt } from 'react-icons/fa';

const archiveProjects = [
  { year: 2022, title: "Harvard Business School Design System", madeAt: "Upstatement", builtWith: "Storybook · React · TypeScript", link: "#" },
  { year: 2022, title: "Threadable", madeAt: "Upstatement", builtWith: "React Native · Ruby on Rails · Firebase", link: "#" },
  { year: 2022, title: "Pratt", madeAt: "Upstatement", builtWith: "WordPress · Timber · WordPress Multisite · Gutenberg · JS", link: "#" },
  { year: 2022, title: "Everytown Gun Law Rankings", madeAt: "Upstatement", builtWith: "WordPress · Timber · PHP · Airtable API", link: "#" },
  { year: 2021, title: "Koala Health", madeAt: "Upstatement", builtWith: "Next.js · TypeScript · Redux Toolkit · Stripe · Algolia · Firebase Auth · Formik · Yup · Vercel", link: "#" },
  { year: 2021, title: "Philadelphia Inquirer Sports Scoreboards", madeAt: "Upstatement", builtWith: "React · TypeScript · Stats Perform API", link: "#" },
  { year: 2021, title: "Vanderbilt Design System", madeAt: "Upstatement", builtWith: "Twig · Puppy · JS", link: "#" },
  { year: 2020, title: "Michelle Wu for Boston Grassroots Toolkit", madeAt: "Upstatement", builtWith: "Gatsby · Styled Components", link: "#" },
  { year: 2020, title: "The 19th News", madeAt: "Upstatement", builtWith: "WordPress · Timber · Gutenberg · PHP · JS · Mailchimp · AMP", link: "#" },
  { year: 2020, title: "Northeastern CSSH", madeAt: "Upstatement", builtWith: "WordPress · Timber · WordPress Multisite · PHP · Algolia · JS", link: "#" },
  { year: 2020, title: "Integrating Algolia Search with WordPress Multisite", madeAt: "Upstatement", builtWith: "Algolia · WordPress · PHP", link: "#" }
];

const Archive = () => {
  return (
    <section className=" text-foreground mt-36  container mx-auto">
      <h1 className="text-4xl font-bold text-muted">Archive</h1>
      <p className="text-primary text-sm md:text-base mt-2">A big list of things I’ve worked on</p>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="text-muted border-b border-muted hidden md:table-row">
              <th className="p-3">Year</th>
              <th className="p-3">Title</th>
              <th className="p-3 hidden md:table-cell">Made at</th>
              <th className="p-3 hidden md:table-cell">Built with</th>
              <th className="p-3">Link</th>
            </tr>
          </thead>
          <tbody>
            {archiveProjects.map((project, index) => (
              <tr key={index} className=" hover:bg-navy transition">
                <td className="p-3 text-primary font-semibold">{project.year}</td>
                <td className="p-3 text-foreground font-semibold">{project.title}</td>
                <td className="p-3 hidden md:table-cell text-muted font-mono">{project.madeAt}</td>
                <td className="p-3 hidden md:table-cell text-muted font-mono">{project.builtWith}</td>
                <td className="p-3">
                  <a href={project.link} target="_blank" rel="noopener noreferrer">
                    <FaExternalLinkAlt className="text-muted hover:text-primary transition" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Archive;