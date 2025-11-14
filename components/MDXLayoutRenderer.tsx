import dynamic from "next/dynamic"
import CustomLink from "./Link"
import { useMemo } from "react"
import Image from "./Image"

export const MDXComponents = {
    Image,
    img: (props: any) => {
        // For markdown images, use Image component with fill
        if (props.src) {
            return (
                <div className="relative w-full my-4" style={{ aspectRatio: '16/9' }}>
                    <Image 
                        src={props.src} 
                        alt={props.alt || ''} 
                        fill={true}
                        className="object-contain"
                    />
                </div>
            )
        }
        // Fallback to regular img tag if no src (with eslint disable for this case)
        // eslint-disable-next-line @next/next/no-img-element
        return <img {...props} alt={props.alt || ''} />
    },
    a: CustomLink,
    wrapper: ({ components, layout, ...rest }: any) => {
        const Layout = require(`../layouts/${layout}`).default
        return <Layout {...rest} />
    },
}

const MDXLayoutRenderer = (props: any) => {
    const { layout, mdxSource, path, ...rest } = props
    const MDXLayout = useMemo(() => dynamic(() => import(`../data/blog/${path}`)), [path])
    return <MDXLayout layout={layout} components={MDXComponents} {...rest} />
}
export default MDXLayoutRenderer