/* eslint-disable @next/next/no-html-link-for-pages */

const NavBar = () => {
  return (
    <div className="mt-0">
      <div className="flex flex-row p-5 justify-between">
        <div>
          <a className="text-xl" href="/">
            TrendTube
          </a>
        </div>
        <div className="flex flex-row gap-10 pr-5">
          <a className="" href="/">
            Home
          </a>
          <a className="" href="/trending">
            Trending
          </a>
          <a className="" href="/complex">
            Example Trends
          </a>
          <a className="" href="/creative">
            Visualizations
          </a>
          <a className="" href="/add-video">
            Add Video
          </a>
          <a className="" href="/friends">
            Find Friends
          </a>
          <a className="" href="/user">
            Update User Information
          </a>
          <a className="" href="/register">
            Login/Register
          </a>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
