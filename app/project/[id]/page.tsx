import { notFound } from "next/navigation"
import Link from "next/link"
import { LuArrowLeft, LuGithub, LuExternalLink, LuChevronRight } from "react-icons/lu";
import Images from "./Images";
import projects from "@/public/projectData.json"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const projectData = projects.find((e) => e.slug === id)
  
  if (!projectData) {
    return {
      title: "Project Not Found",
      description: "The requested project could not be found."
    }
  }
  const mainImage = projectData.images[0]?.url || "/og-image.jpg"

  return {
    title: `${projectData.title} | Vivek Chaturvedi Portfolio`,
    description: projectData.description,
    keywords: [...projectData.technologies, "Software Development", "Project", projectData.title],
    openGraph: {
      title: `${projectData.title} - Vivek Chaturvedi`,
      description: projectData.description,
      type: "article",
      images: [
        {
          url: mainImage,
          width: 1200,
          height: 630,
          alt: `${projectData.title} - Project by Vivek Chaturvedi`
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: `${projectData.title} - Vivek Chaturvedi`,
      description: projectData.description,
      images: [mainImage]
    }
  }
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const projectData = projects.find((e) => e.slug === id)
  if (!projectData) return notFound()

  return (
    // bg-gradient-to-b from-gray-950 to-gray-900
    <div className="min-h-screen  text-gray-200 font-sans pt-[100px]"> 
      <header className="sticky top-0 z-10 backdrop-blur-md bg-gray-950/80 border-b border-gray-800">
        <div className="container mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-300 hover:text-white transition-all group">
            <LuArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to projects</span>
          </Link>
          <div className="flex gap-4">
            {projectData.companyProject && (
              <div className="flex items-center gap-2 bg-gray-800 text-gray-300 px-3 py-1.5 rounded-md">
                <span className="hidden sm:inline">{projectData.companyNote}</span>
                <span className="sm:hidden">Company Project</span>
              </div>
            )}
            {projectData.githubUrl && (
              <Link
                href={projectData.githubUrl}
                target="_blank"
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-all px-3 py-1.5 rounded-md hover:bg-gray-800"
              >
                <LuGithub className="h-5 w-5" />
                <span className="hidden sm:inline">Source</span>
              </Link>
            )}
            {projectData.liveUrl && (
              <Link
                href={projectData.liveUrl}
                target="_blank"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white transition-all px-3 py-1.5 rounded-md"
              >
                <LuExternalLink className="h-5 w-5" />
                <span className="hidden sm:inline">Live Demo</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-6xl px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            {projectData.title}
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl">{projectData.description}</p>
        </div>

        <Images images={projectData.images} videoUrl={projectData.videoUrl} />

        {/* Media Section */}
        <div className="mb-16 bg-gray-900/50 rounded-xl p-6 border border-gray-800 shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-white flex items-center">
            <span className="bg-blue-600 w-1.5 h-6 rounded-full mr-3"></span>
            Technologies Used
          </h2>
          <div className="flex flex-wrap gap-3">
            {projectData.technologies.map((tech, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-750 text-gray-200 rounded-lg text-sm font-medium border border-gray-700 transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {projectData.content.map((section, index) => (
            <div
              key={index}
              className="p-6 border border-gray-800 rounded-xl shadow-lg bg-gray-900/50 hover:bg-gray-900/70 transition-colors"
            >
              <h3 className="text-2xl font-semibold mb-4 text-white flex items-center">
                <span className="bg-purple-600 w-1.5 h-6 rounded-full mr-3"></span>
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.descriptions.map((desc, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-300">
                    <LuChevronRight className="h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" />
                    <span>{desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

