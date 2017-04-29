namespace theupsyde.Controllers

open Microsoft.AspNetCore.Mvc

type PresentationsController () =
    inherit Controller()

    member this.Index () =
        this.View()

    member this.Invest () = 
        this.View()

    member this.LeanEstimates() =
        this.View()