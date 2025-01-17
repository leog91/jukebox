
import { db } from "../db/db";
import { artists } from "../db/schema";

import artistsJson from "../../db/artist.json"


// export const fillDb = () => {

//     artistsJson.forEach(async artist => {



//         await db.insert(artists).values({ name: artist.artist })

//         console.log(artist.artist)

//     });

//     console.log("DONE ALL")

// }




console.log(artistsJson.length)