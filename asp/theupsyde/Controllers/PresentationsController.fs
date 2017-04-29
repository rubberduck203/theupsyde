namespace theupsyde.Controllers

open Microsoft.AspNetCore.Mvc

type PresentationsController () =
    inherit Controller()

    member this.Index () =
        this.View()