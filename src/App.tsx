// import {mount} from 'dashboard/Dashboard'

// const Dashboard = (): React.ReactElement => {
//     const ref = useRef(null);
//
//     useEffect(() =>{
//         mount(ref.current);
//     }, [])
//
//     return <div ref={ref} />
// }

import React from "react";
import "./app.css";
import image from "./image.jpeg";

const App = (): React.ReactElement => {
	return (
		<>
			<h1 className="test">My sda das</h1>
			<p>dadas ada dasdada dsadada dsds dsadadasdasa</p>
			<img style={{ width: 300, height: 300 }} src={image} alt="" />
			{/*<Dashboard />*/}
		</>
	);
};

export default App;
