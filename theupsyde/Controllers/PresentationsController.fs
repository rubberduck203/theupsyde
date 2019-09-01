namespace theupsyde.Controllers

open Microsoft.AspNetCore.Mvc

type PresentationsController () =
    inherit Controller()

    member this.Index () =
        this.View()

    member this.Invest () = 
        this.View()

    member this.LeanEstimates () =
        this.View()

    member this.Kanban101 () =
        this.View()

    member this.CrashCourseDocker () =
        this.View()

    member this.ElixirLogger () =
        this.View()