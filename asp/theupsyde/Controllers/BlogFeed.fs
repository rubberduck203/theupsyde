namespace TheUpsyde.Controllers

open System
open System.Collections.Generic
open System.Linq
open System.Threading.Tasks
open Microsoft.AspNetCore.Mvc

[<Route("api/[controller]")>]
type BlogFeedController () =
    inherit Controller()

    // GET api/values
    [<HttpGet>]
    member this.Get() =
        ["value1"; "value2" ]
        
