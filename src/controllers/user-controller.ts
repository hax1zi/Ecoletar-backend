
import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where} from "firebase/firestore"
import { db } from "../firebase/config"
import { z } from "zod"
import {user_schema, login_schema} from "../models/models"
import { verify_password } from "../utils/bcryptUtils"

type login_schema = z.infer<typeof login_schema>
type user_params = z.infer<typeof user_schema>
const users_collection = collection(db, 'users')

const get_users = async () => {
    const data = await getDocs(users_collection)
    const user_list = data.docs.map((doc) => ({...doc.data()}))
    const list = user_list.map((unused, index) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {password, ...listWithoutPassword} = user_list[index]
        return listWithoutPassword
      })

    return list
}

const check_email = async (email: string) => {
    const q = query(users_collection, where("email", "==", email))
    const query_snapshot = await getDocs(q)

    if (query_snapshot.empty) {return false}

    return true
}

const check_login = async (login: login_schema) => {
    const q = query(users_collection, where('email', '==', login.email))
    const query_snapshot = await getDocs(q)

    if (query_snapshot.empty) { return false }

    const user = query_snapshot.docs[0].data()

    const check = await verify_password(login.password, user.password)

    if (check) {
        return {check, user_ID: user.id}
    } else {
        return false
    }
}

const create_user = async (user: user_params) => {
    await addDoc(users_collection, user)
}

const update_user = async (user_id: string, user: user_params) => {
    const q = query(users_collection,  where('id', '==', user_id))
    const query_snapshot = await getDocs(q)

    if (!query_snapshot.empty) {
        const doc_id = query_snapshot.docs[0].id
        const doc_ref = doc(users_collection, doc_id)
        await updateDoc(doc_ref, user)
        return true
    } else {
        return false
    }
}

const delete_user = async (id: string) => {
    const q = query(users_collection, where('id', '==', id))
    const query_snapshot = await getDocs(q)

    if (!query_snapshot.empty) {
        const doc_id = query_snapshot.docs[0].id
        const doc_ref = doc(users_collection, doc_id)
        await deleteDoc(doc_ref)
        return true
    }
    return false

}

export {get_users, check_email, create_user, update_user, check_login, delete_user}