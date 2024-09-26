import { z } from "zod"
import { availability_schema, first_login_schema, user_schema } from "../models/models"
import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore"
import { db } from "../firebase/config"

type availability_schema = z.infer<typeof availability_schema>
type user_params = z.infer<typeof user_schema>
type first_login_params = z.infer<typeof first_login_schema>
const ecoletar_collection = collection(db, 'Ecoletar')
const users_collection = collection(db, 'users')

const first_login_verification = async (id: string) => {
    const q = query(users_collection, where("id", "==", id))
    const query_snapshot = await getDocs(q)

    if (query_snapshot.empty) {return false}

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user: user_params | any = query_snapshot.docs[0].data()

    if (user.first_login === true) {
        return true
    } else {
        return false
    }

}

const first_login_confirmation = async (first_login: first_login_params, id: string) => {
    const q = query(users_collection, where("id", "==", id))
    const query_snapshot = await getDocs(q)

    if (!query_snapshot.empty) {
        const doc_id = query_snapshot.docs[0].id
        const doc_ref = doc(users_collection, doc_id)
        await updateDoc(doc_ref, first_login)
        return true
    }
    return false
}

const remove_info_in_ecoletar = async (first_login_scheduling: first_login_params) => {
    const q_ecoletar = query(ecoletar_collection, where("city", "==", first_login_scheduling.city))

    const query_snapshot_ecoletar = await getDocs(q_ecoletar)

    if (!query_snapshot_ecoletar.empty) {
        const doc_to_update = query_snapshot_ecoletar.docs[0]
        const doc_ref = doc(ecoletar_collection, doc_to_update.id)

        const data = doc_to_update.data()
        const days = data.days

        if (days[first_login_scheduling.scheduled_days] && days[first_login_scheduling.scheduled_days].includes(first_login_scheduling.scheduled_time)) {
            days[first_login_scheduling.scheduled_days] = days[first_login_scheduling.scheduled_days].filter((h: string) => h !== first_login_scheduling.scheduled_time)

            await updateDoc(doc_ref, {
                days: days
            })

            return true
        } else {
            return false
        }
    }
}


export {first_login_verification, first_login_confirmation, remove_info_in_ecoletar}