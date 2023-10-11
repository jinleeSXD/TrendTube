import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import ChannelView from "@/components/channelView";
import FavoriteChannelView from "@/components/favoriteChannelView";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <FavoriteChannelView />
      <ChannelView />
    </>
  );
}
