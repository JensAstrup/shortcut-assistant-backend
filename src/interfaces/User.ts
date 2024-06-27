import WorkspaceInterface from '@sb/interfaces/Workspace'


interface UserInterface {
    id?: number
    name: string
    email: string
    shortcutApiToken: string
    googleId: string
    googleAuthToken: string
    workspace?: WorkspaceInterface
    createdAt?: Date
    updatedAt?: Date
}

export default UserInterface
