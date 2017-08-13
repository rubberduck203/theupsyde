module BlogService

open System.Net
open System
open System.IO
open System.Xml
open System.Linq

let fetchUrl url = 
    let req = WebRequest.Create(Uri(url)) 
    use resp = req.GetResponse() 
    use stream = resp.GetResponseStream() 
    use reader = new IO.StreamReader(stream) 
    reader.ReadToEnd()

//test
let blogFeed = fetchUrl "https://christopherjmcclellan.wordpress.com/feed/"


