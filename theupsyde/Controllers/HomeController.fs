namespace theupsyde.Controllers

open System
open System.Collections.Generic
open System.Linq
open System.Threading.Tasks
open Microsoft.AspNetCore.Mvc
open Rss
open System.Net

type HomeController () =
    inherit Controller()

    let fetchUrl url = async {
        let req = WebRequest.Create(Uri(url))
        use! resp = req.GetResponseAsync() |> Async.AwaitTask
        use stream = resp.GetResponseStream()
        use reader = new IO.StreamReader(stream)
        return reader.ReadToEnd()
    }

    let fetchRss() = async {
        let! content = fetchUrl "https://christopherjmcclellan.wordpress.com/feed/"
        return Rss.parse content
    }

    member this.Index () = Async.StartAsTask(async {
        let! rss = fetchRss()
        return this.View(rss.Channel)
    })

    member this.Recent() = Async.StartAsTask(async {
        let! rss = fetchRss()
        return this.PartialView("BlogPosts", rss.Channel.Items)
    })

    member this.Latest () = Async.StartAsTask(async {
        let! rss = fetchRss()
        let latest =
            rss.Channel.Items
            |> Seq.head

        return this.PartialView("BlogPost", latest)
    })

    member this.About () =
        this.ViewData.["Message"] <- "Your application description page."
        this.View()

    member this.Contact () =
        this.ViewData.["Message"] <- "Your contact page."
        this.View()

    member this.Error () =
        this.View();
