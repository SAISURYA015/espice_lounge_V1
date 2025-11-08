import VideosImage from "./VideosImage";

export default async function Page({ searchParams }) {
  // Get ?imageId=xyz from the URL safely
  const videoId = (await searchParams.videoId) || null;

  return <VideosImage videoId={videoId} />;
}
