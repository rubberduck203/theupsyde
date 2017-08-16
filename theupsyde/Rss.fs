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
    // Helper Functions
    let private innerText (elementName: string) (node: XmlNode) =
        let element = node.Item elementName
        element.InnerText

    let private titleText =
        innerText "title"

    let private descriptionText =
        innerText "description"

    let private elementAsDateTimeOffset elementName =
        innerText elementName >> DateTimeOffset.Parse

    let private elementAsUri elementName =
        innerText elementName >> Uri

    let private linkUri =
        elementAsUri "link"

    let private itemNodeToItem node = {
        Title = node |> titleText
        Link =  node |> linkUri
        Comments = node |> elementAsUri "comments"
        PublishDate = node |> elementAsDateTimeOffset "pubDate"
        Description = node |> descriptionText
     }

    
    ///**Description**
    /// Parses an RSS feed in xml format and returns an `RssFeed` record.
    /// This is not a full implementation of the RSS spec. 
    /// This is only meant to parse a subset of the fields available in a Wordpress blog feed.
    ///**Parameters**
    ///  * `input` - a `string` containing an RSS feed in Xml format
    ///
    ///**Output Type**
    ///  * `RssFeed`
    ///
    ///**Exceptions**
    ///
    let parse input =
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