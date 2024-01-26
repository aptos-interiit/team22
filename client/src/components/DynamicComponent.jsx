import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import SideSlider from "../pages/SideSlider";
import Navbar from "../pages/Navbar.jsx";
import DaoFrontend from "../pages/DaoFrontend.jsx";
import ProfilePg from "../pages/ProfilePg.jsx";
import UserPage from "../pages/UserPage.jsx";
import AddSongPage from "../pages/AddSongPage.jsx";
import YourRadio from "../pages/YourRadio.jsx";
import AllRadios from "../pages/AllRadios.jsx";
import PlaylistSpace from "./PlaylistSpace.jsx";
import ArtistSongsSpace from "./ArtistSongsSpace.jsx";

const DynamicComponent = ({ component, user, load, handleDeposit }) => {
    const renderContent = () => {
        switch (component) {
            case 'daoFrontend':
                return <DaoFrontend />;
            case 'profile':
                return <ProfilePg />;
            case 'userPage':
                return <UserPage />;
            case 'addSong':
                return <AddSongPage />;
            case 'yourRadio':
                return <YourRadio />;
            case 'allRadios':
                return <AllRadios />;
            case 'playlistSpace':
                return <PlaylistSpace />;
            case 'artistSongsSpace':
                return <ArtistSongsSpace />;
            default:
                return null;
        }
    };

    return (
        <>
            <div className="bg-black flex">
                <div className="border-e">
                    <SideSlider />
                </div>
                <div className="w-full">
                    {load ? (
                        <>
                            <div className="max-h-screen overflow-y-scroll">
                                <Navbar savings={user ? user.savings : 0} handleDeposit={handleDeposit}></Navbar>
                                {renderContent()}
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="loader"></div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default DynamicComponent;
