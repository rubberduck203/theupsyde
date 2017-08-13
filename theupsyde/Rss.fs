module Rss
    open System

    type Item = {
        Title: string
        Link: Uri
        Comments: Uri
        PublishDate: DateTimeOffset
        Description: string
    }

    type Channel = {
        Title: string
        Link: Uri
        Description: string
        LastBuildDate: DateTimeOffset
        Items: seq<Item>
    }

    type RssFeed = {
        Version: double
        Channel: Channel
    }

    open System.Xml
    let parse input =

        // Helper Functions
        let innerText (elementName: string) (node: XmlNode) =
            let element = node.Item elementName
            element.InnerText

        let titleText node =
            node |> innerText "title"

        let descriptionText node =
            node |> innerText "description"

        let elementAsDateTimeOffset elementName node =
            node |> innerText elementName |> DateTimeOffset.Parse

        let elementAsUri elementName node =
            node |> innerText elementName |> Uri

        let linkUri node =
            node |> elementAsUri "link"

        let itemNodeToItem node = {
            Title = node |> titleText
            Link =  node |> linkUri
            Comments = node |> elementAsUri "comments"
            PublishDate = node |> elementAsDateTimeOffset "pubDate"
            Description = node |> descriptionText
         }

        // Load the document and begin parsing
        let document = XmlDocument()
        document.LoadXml input

        let rss = document.DocumentElement
        let channelNode = rss.FirstChild

        let items =
            channelNode.ChildNodes
            |> Seq.cast<XmlNode>
            |> Seq.filter (fun node -> node.Name.Equals "item")
            |> Seq.map itemNodeToItem

        let channel = {
            Title = channelNode |> titleText
            Link = channelNode |> linkUri
            Description = channelNode |> descriptionText
            LastBuildDate = channelNode |> elementAsDateTimeOffset "lastBuildDate"
            Items = items
        }

        let version =
            (rss.Attributes.ItemOf "version").Value
            |> Double.Parse

        let rssFeed = {Version = version; Channel = channel}
        rssFeed