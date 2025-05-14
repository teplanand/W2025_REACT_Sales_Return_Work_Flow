import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";

const About = () => {
    return(
        <div>
            <div className="text-2xl text-center pt-8 border-t">
                <Title text1={""} text2={"ABOUT US"}/>
            </div>

            <div className="my-10 flex flex-col md:flex-row gap-16">
                <img className="w-full md:max-w-[450px]" src={assets.about_img} alt="" />
                <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
                    <p>Founded in 2025, NextGear began as a small engineering company focused on developing compact equipment. Driven by a passion for innovation and a strong commitment to quality, NextGear is steadily emerging as a trusted name in engineering and gear manufacturing projects across India.</p>

                    <b className="text-gray-800">Our Mission</b>
                    <p>Expand our presence in both established and emerging markets by collaborating with new partners and strengthening our position in existing ones. Stay ahead in technology by continually investing in research and development to explore new applications, industries, and improve our current product offerings.</p>
                </div>
            </div>

        </div>
    )
}

export default About;