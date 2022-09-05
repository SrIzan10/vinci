#!/usr/bin/node
const express = require('express');
const app = express();
const si = require('systeminformation');
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// use the express-static middleware
app.use(express.static("public"))

app.get("/cpubrand", async function (req, res) {
  const cpu = await si.cpu()
  res.send(`${cpu.manufacturer} ${cpu.brand}`)
})

app.get("/cpucores", async function (req, res) {
  const cpu = await si.cpu()
  res.send(`${cpu.cores}`)
})

app.get("/cpucores", async function (req, res) {
  const cpu = await si.cpuTemperature()
  res.send(`${cpu.main}`)
})

app.get("/ramtotal", async function (req, res) {
  const ram = await si.mem()
  res.send(`${formatBytes(ram.total)}`)
})

app.get("/ramfree", async function (req, res) {
  const ram = await si.mem()
  res.send(`${formatBytes(ram.free)}`)
})

app.get("/dockertotal", async function (req, res) {
  const docker = await si.dockerInfo()
  res.send(`${docker.containers}`)
})

// start the server listening for requests
app.listen(7271,
	() => console.log("The webserver is listening on port " + 7271));