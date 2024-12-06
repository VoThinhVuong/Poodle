import Navbar from "../../Components/Navbar";
import Footer from "../Components/Footer";
import Home_courses from "../../Components/Home_courses";

import "../styles/Home.css";

function Home() {

  const [user] = useCookies(['user'], {
		doNotParse: false,
		doNotUpdate: false
	});
  return (
    <div className="home">
      <Navbar/>
      <div className='Header'>
        <h1>Welcome to P o o d l e!</h1>
        <h1>My courses:</h1>
      </div>
      <Home_courses accountID={user.ID} role={user.role}></Home_courses>
      <Footer/>
    </div>
  )
}

export default Home