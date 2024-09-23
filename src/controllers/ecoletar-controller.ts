import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { z } from "zod";
import { availability_schema, types_of_garbage_schema } from "../models/models";

const ecoletar_collection = collection(db, 'Ecoletar')

type availability_schema = z.infer<typeof availability_schema>
type types_of_garbage_schema = z.infer<typeof types_of_garbage_schema>

const get_availability = async () => {
    const data = await getDocs(ecoletar_collection)
    const data_list = data.docs.map((doc) => ({...doc.data()}))
    return data_list
}

export {get_availability}