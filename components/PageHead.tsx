import Head from 'next/head'

export default function PageHead() {
  const description =
    "Enter a text message conversation and decipher your crush's mixed signals and cryptic messages..."
  const title = 'Do They Like You?'
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />

      <meta property="og:description" content={description} />
      <meta name="twitter:description" content={description} />

      <meta property="og:title" content={title} />
      <meta name="twitter:title" content={title} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://dotheylike.me/" />
      <meta property="twitter:domain" content="dotheylike.me" />

      {/* <meta name="twitter:creator" content="@FoldedCode" /> */}

      <meta name="twitter:card" content="summary_large_image" />
      <meta
        name="twitter:image"
        content="https://dotheylike.me/social-image.png"
      />
      <meta
        property="og:image"
        content="https://dotheylike.me/social-image.png"
      />
    </Head>
  )
}
