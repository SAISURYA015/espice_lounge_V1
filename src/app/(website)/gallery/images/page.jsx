import GalleryImage from "./GalleryImage";

export default async function Page({ searchParams }) {
  // Get ?imageId=xyz from the URL safely
  const imageId = (await searchParams.imageId) || null;

  return <GalleryImage imageId={imageId} />;
}
