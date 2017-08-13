module Rss =
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
        let document = XmlDocument()
        document.LoadXml input
        let rss = document.DocumentElement
        let version = rss.Attributes.ItemOf "version"
        
        let channelNode = rss.FirstChild

        let innerText (node: XmlNode) (name: string) =
            let element = node.Item name
            element.InnerText

        let itemNodeToItem node = {
            Title = innerText node "title"
            Link = Uri(innerText node "link")
            Comments = Uri(innerText node "comments")
            PublishDate = DateTimeOffset.Parse(innerText node "pubDate")
            Description = innerText node "description"
         }

        let items =
            channelNode.ChildNodes
            |> Seq.cast<XmlNode>
            |> Seq.filter (fun node -> node.Name.Equals "item")
            |> Seq.map itemNodeToItem
        
        let channelElementValue name =
            innerText channelNode name

        let channel = {
            Title = channelElementValue "title"
            Link = Uri(channelElementValue "link")
            Description = channelElementValue "description"
            LastBuildDate = DateTimeOffset.Parse(channelElementValue "lastBuildDate")
            Items = items
        }

        {Version = Double.Parse version.Value; Channel = channel}