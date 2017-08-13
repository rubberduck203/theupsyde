namespace theupsyde.Controllers

open System
open System.Collections.Generic
open System.Linq
open System.Threading.Tasks
open Microsoft.AspNetCore.Mvc
open Rss

type BlogController () =
    inherit Controller()

    member this.Index () =
        let rssFeed = Rss.parse BlogService.blogFeed
        this.View(rssFeed.Channel)

    member this.Latest () =
        let latest = 
            BlogService.blogFeed
            |> Rss.parse
            |> (fun rssFeed -> rssFeed.Channel.Items)
            |> Seq.head

        this.PartialView("BlogPost", latest)
        