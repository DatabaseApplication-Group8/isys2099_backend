//? CONFIGURE SERVER RESPONSE
export default (res: any, message: string, code: number, data: JSON) => {
    res.status(code).json({
        message,
        code,
        data,
        date: new Date()
    })
}