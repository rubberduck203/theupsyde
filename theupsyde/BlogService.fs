module BlogService

open System.Net
open System
open System.IO
open System.Xml
open System.Linq

let fetchUrl url = async {
    let req = WebRequest.Create(Uri(url)) 
    let! resp = req.GetResponseAsync() |> Async.AwaitTask
    use stream = resp.GetResponseStream() 
    use reader = new IO.StreamReader(stream) 
    return reader.ReadToEnd()
}
let blogFeed = fetchUrl "https://christopherjmcclellan.wordpress.com/feed/" 
                |> Async.RunSynchronously


