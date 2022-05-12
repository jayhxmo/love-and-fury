import { createRef } from "react";

const state = {
	sections: 4,
	pages: 2,
	zoom: 75,
	top: createRef(),
	images: [
		"/photo-1548191265-cc70d3d45ba1.jpeg",
		"/photo-1519608487953-e999c86e7455.jpeg",
		"/photo-1533577116850-9cc66cad8a9b.jpeg",
	],
	paragraphs: [
		{
			offset: 1,
			factor: 1.75,
			header: "District 4",
			image: "/photo-1515036551567-bf1198cccc35.jpeg",
			aspect: 1.51,
			text: "Two thousand pharmacologists and bio-chemists were subsidized. Six years later it was being produced commercially.",
		},
	],
};

export default state;
