import React,{Fragment} from "react";
import Card from "../UI/Card/Card";
import Jumbotron from '../UI/Jumbotron/Jumbotron';
import './Classroom.css';
const Classroom=()=>{
    return(
   <Fragment>
      <Jumbotron title="Class Resources" description="Semster wise Teacher's Slides and notes..."/>
      <div className="classroom">
        <div className="card-deck">
        
            <Card title="Semester 1" link="/classroom/semester1" linkText="Go to Semester1"/>
            <Card title="Semester 2" link="/classroom/semester2" linkText="Go to Semester2"/>
            <Card title="Semester 3" link="/classroom/semester3" linkText="Go to Semester3"/>
            <Card title="Semester 4" link="/classroom/semester4" linkText="Go to Semester4"/>
            <Card title="Semester 5" link="/classroom/semester5" linkText="Go to Semester5"/>
            <Card title="Semester 6" link="/classroom/semester6" linkText="Go to Semester6"/>
         </div>
         </div>
         
    </Fragment>
    );
};
export default Classroom;