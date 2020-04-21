const fs = require("fs")

const {
  asyncReadFile,
  asyncWriteFile
} = require('./dao')

exports.getAllAccounts = (req, res) => fs.readFile(req.app.locals.dataFilePath, "utf-8", (err, data) => {
  res.send(JSON.parse(data))
})

exports.createAccount = async (req, res) => {
  const newAccount = req.body
  const file = await asyncReadFile(req.app.locals.dataFilePath)
  const accounts = JSON.parse(file)
  if (accounts.filter(v => v.email === newAccount.email).length != 0) {
    res.status(400).send()
  } else {
    accounts.push(newAccount)
    await asyncWriteFile(JSON.stringify(accounts), req.app.locals.dataFilePath)
    res.status(201).send(accounts)
  }
}

exports.updateAccount = async (req, res) => {
  const put = req.body
  const file = await asyncReadFile(req.app.locals.dataFilePath)
  const accounts = JSON.parse(file)
  const candidates = accounts.filter(v => v.email === put.email)
  if (candidates.length === 0) {
    this.createAccount(req, res)
  } else {
    accounts.forEach((value, index, array) => {
      if (value.email === put.email) {
        array[index] = {
          ...value,
          ...put
        }
      }
    })
    await asyncWriteFile(JSON.stringify(accounts), req.app.locals.dataFilePath)
    res.status(200).send()
  }
}

exports.deleteAccount = async (req, res) => {
  const email = req.params.id
  const file = await asyncReadFile(req.app.locals.dataFilePath)
  const accounts = JSON.parse(file)
  const newAccounts = accounts.filter(v => v.email !== email)
  if (newAccounts.length === accounts.length) {
    res.status(404).send()
  } else {
    await asyncWriteFile(JSON.stringify(newAccounts), req.app.locals.dataFilePath)
    res.status(204).send()
  }

}
