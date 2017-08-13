namespace theupsyde.Controllers

open System
open System.Collections.Generic
open System.Linq
open System.Threading.Tasks
open Microsoft.AspNetCore.Mvc
open Rss

type BlogController () =
    inherit Controller()

    let rssFeed =
        BlogService.blogFeed
        |> Rss.parse

    let recent = 
        rssFeed
        |> (fun rssFeed -> rssFeed.Channel.Items)

    member this.Index () =
        let rssFeed = Rss.parse BlogService.blogFeed
        this.View(rssFeed.Channel)

    member this.Recent() =
        this.PartialView("BlogPosts", recent)

    member this.Latest () =
        let latest = 
            recent
            |> Seq.head

        this.PartialView("BlogPost", latest)
        