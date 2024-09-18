import bcrypt from 'bcrypt'

const salt_rounds = 10

async function hash_password(password: string) {
    try{
        const hashed_password = await bcrypt.hash(password, salt_rounds)
        return hashed_password
    } catch (err) {
        throw new Error(`Error encrypting password: ${err instanceof Error ? err.message : err}`)
    }
}

async function verify_password(password: string, hashed_password: string) {
    try {
        const match = await bcrypt.compare(password, hashed_password)
        return match
    } catch (err) {
        throw new Error(`Error verifying password: ${err instanceof Error ? err.message : err}`)
    }
}

export {hash_password, verify_password}