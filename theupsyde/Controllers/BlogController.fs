namespace theupsyde.Controllers

open System
open System.Collections.Generic
open System.Linq
open System.Threading.Tasks
open Microsoft.AspNetCore.Mvc
open Rss
open System.Net

type BlogController () =
    inherit Controller()

    let fetchUrl url = async {
        let req = WebRequest.Create(Uri(url)) 
        let! resp = req.GetResponseAsync() |> Async.AwaitTask
        use stream = resp.GetResponseStream() 
        use reader = new IO.StreamReader(stream) 
        return reader.ReadToEnd()
    }

    let rssFeed =
        fetchUrl "https://christopherjmcclellan.wordpress.com/feed/" 
        |> Async.RunSynchronously
        |> Rss.parse

    let recent =
        rssFeed.Channel.Items

    member this.Index () =
        this.View(rssFeed.Channel)

    member this.Recent() =
        this.PartialView("BlogPosts", recent)

    member this.Latest () =
        let latest = 
            recent
            |> Seq.head

        this.PartialView("BlogPost", latest)
        