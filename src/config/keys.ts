import * as fs from 'fs'

export const keys = {
    privateKey: fs.readFileSync('src/config/jwtRS256.key', 'utf8'),
    publicKey: fs.readFileSync('src/config/jwtRS256.key.pub', 'utf8')
}
