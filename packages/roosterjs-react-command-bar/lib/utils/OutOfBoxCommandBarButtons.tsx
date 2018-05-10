import { DefaultButton } from "office-ui-fabric-react/lib/Button";
import { DirectionalHint, IContextualMenuItem } from "office-ui-fabric-react/lib/ContextualMenu";
import { FocusZoneDirection } from "office-ui-fabric-react/lib/FocusZone";
import { IIconProps } from "office-ui-fabric-react/lib/Icon";
import * as React from "react";
import {
    clearFormat,
    removeLink,
    setBackgroundColor,
    setIndentation,
    setTextColor,
    toggleBold,
    toggleBullet,
    toggleHeader,
    toggleItalic,
    toggleNumbering,
    toggleStrikethrough,
    toggleUnderline
} from "roosterjs-editor-api";
import { Editor } from "roosterjs-editor-core";
import { FormatState, Indentation } from "roosterjs-editor-types";

import { RoosterCommandBarButton, RoosterCommandBarProps, RoosterCommandBarState } from "../schema/RoosterCommandBarSchema";
import { ColorInfo, FontColorInfoList, HighlightColorInfoList } from "./OutOfBoxCommandBarItem.ColorInfo";
import { createLinkWithPrompt } from "roosterjs-react-common";

const RoosterCommandBarIconClassName = "rooster-command-bar-icon";

export const RoosterCommandBarStringKeys = {
    LinkPrompt: "linkPrompt"
};

export const RoosterCommmandBarButtonKeys = {
    Header: "header",
    Bold: "bold",
    Italic: "itatlic",
    Underline: "underline",
    BulletedList: "bulleted-list",
    NumberedList: "numbered-list",
    Link: "link",
    Highlight: "highlight",
    ClearFormat: "clear-format",
    Emoji: "emoji",
    InsertImage: "insert-image",
    Indent: "indent",
    Outdent: "outdent",
    Strikethrough: "strikethrough",
    FontColor: "font-color",
    Unlink: "unlink"
};

export const OutOfBoxCommandBarButtons: RoosterCommandBarButton[] = [
    {
        key: RoosterCommmandBarButtonKeys.Header,
        name: "Header",
        iconProps: _getIconProps("FontSize"),
        subMenuProps: {
            key: "header-sub",
            shouldFocusOnMount: true,
            directionalHint: DirectionalHint.bottomLeftEdge,
            items: [
                {
                    key: "header1",
                    name: "Header 1",
                    className: "rooster-command-bar-header1",
                    headerLevel: 1,
                    canCheck: true,
                    getChecked: _getCheckedForHeader,
                    handleChange: _handleChangeForHeader,
                    iconProps: null
                },
                {
                    key: "header2",
                    name: "Header 2",
                    className: "rooster-command-bar-header2",
                    headerLevel: 2,
                    canCheck: true,
                    getChecked: _getCheckedForHeader,
                    handleChange: _handleChangeForHeader,
                    iconProps: null
                },
                {
                    key: "header3",
                    name: "Header 3",
                    className: "rooster-command-bar-header3",
                    headerLevel: 3,
                    canCheck: true,
                    getChecked: _getCheckedForHeader,
                    handleChange: _handleChangeForHeader,
                    iconProps: null
                }
            ]
        }
    },
    {
        key: RoosterCommmandBarButtonKeys.Bold,
        name: "Bold",
        iconProps: _getIconProps("Bold"),
        canCheck: true,
        getSelected: (formatState: FormatState) => formatState.isBold,
        handleChange: (editor: Editor) => toggleBold(editor)
    },
    {
        key: RoosterCommmandBarButtonKeys.Italic,
        name: "Italic",
        iconProps: _getIconProps("Italic"),
        canCheck: true,
        getSelected: (formatState: FormatState) => formatState.isItalic,
        handleChange: (editor: Editor) => toggleItalic(editor)
    },
    {
        key: RoosterCommmandBarButtonKeys.Underline,
        name: "Underline",
        iconProps: _getIconProps("Underline"),
        canCheck: true,
        getSelected: (formatState: FormatState) => formatState.isUnderline,
        handleChange: (editor: Editor) => toggleUnderline(editor)
    },
    {
        key: RoosterCommmandBarButtonKeys.BulletedList,
        name: "Bulleted list",
        iconProps: _getIconProps("BulletedList"),
        canCheck: true,
        getSelected: (formatState: FormatState) => formatState.isBullet,
        handleChange: (editor: Editor) => toggleBullet(editor)
    },
    {
        key: RoosterCommmandBarButtonKeys.NumberedList,
        name: "Numbered list",
        iconProps: _getIconProps("NumberedList"),
        canCheck: true,
        getSelected: (formatState: FormatState) => formatState.isNumbering,
        handleChange: (editor: Editor) => toggleNumbering(editor)
    },
    {
        key: RoosterCommmandBarButtonKeys.Link,
        name: "Link",
        iconProps: _getIconProps("Link"),
        handleChange: (editor: Editor, props: RoosterCommandBarProps) => createLinkWithPrompt(editor, props.strings)
    },
    {
        key: RoosterCommmandBarButtonKeys.Highlight,
        name: "Highlight",
        iconProps: _getIconProps("Highlight"),
        subMenuProps: {
            className: "rooster-command-bar-color-container",
            key: "highlight-sub",
            shouldFocusOnMount: true,
            directionalHint: DirectionalHint.bottomLeftEdge,
            focusZoneProps: { direction: FocusZoneDirection.bidirectional },
            items: HighlightColorInfoList.map(
                (color: ColorInfo) =>
                    ({
                        className: "rooster-command-bar-color-item",
                        key: color.key,
                        title: color.title,
                        onRender: _colorCellOnRender,
                        data: color,
                        handleChange: _handleChangeForHighlight
                    } as IContextualMenuItem)
            )
        }
    },
    {
        key: RoosterCommmandBarButtonKeys.ClearFormat,
        name: "Clear format",
        iconProps: _getIconProps("ClearFormatting"),
        handleChange: (editor: Editor) => clearFormat(editor)
    },
    {
        key: RoosterCommmandBarButtonKeys.Emoji,
        name: "Emoji",
        iconProps: { className: `${RoosterCommandBarIconClassName} rooster-emoji` } as IIconProps,
        handleChange: (editor: Editor, props: RoosterCommandBarProps) => {
            props.emojiPlugin.setIsSuggesting(true);
            editor.insertContent(":");
        }
    },
    {
        key: RoosterCommmandBarButtonKeys.InsertImage,
        name: "Insert image",
        iconProps: _getIconProps("Photo2")
    },
    {
        key: RoosterCommmandBarButtonKeys.Indent,
        name: "Increase indent",
        iconProps: _getIconProps("IncreaseIndentLegacy"),
        handleChange: editor => setIndentation(editor, Indentation.Increase)
    },
    {
        key: RoosterCommmandBarButtonKeys.Outdent,
        name: "Decrease indent",
        iconProps: _getIconProps("DecreaseIndentLegacy"),
        handleChange: editor => setIndentation(editor, Indentation.Decrease)
    },
    {
        key: RoosterCommmandBarButtonKeys.Strikethrough,
        name: "Strikethrough",
        iconProps: _getIconProps("Strikethrough"),
        getSelected: (formatState: FormatState) => formatState.isStrikeThrough,
        handleChange: (editor: Editor) => toggleStrikethrough(editor)
    },
    {
        key: RoosterCommmandBarButtonKeys.FontColor,
        name: "Font color",
        iconProps: _getIconProps("FontColor"),
        subMenuProps: {
            className: "rooster-command-bar-color-container",
            key: "font-color-sub",
            shouldFocusOnMount: true,
            directionalHint: DirectionalHint.bottomLeftEdge,
            focusZoneProps: { direction: FocusZoneDirection.bidirectional },
            items: FontColorInfoList.map(
                (color: ColorInfo) =>
                    ({
                        className: "rooster-command-bar-color-item",
                        key: color.key,
                        title: color.title,
                        onRender: _colorCellOnRender,
                        data: color,
                        handleChange: _handleChangeForFontColor
                    } as IContextualMenuItem)
            )
        }
    },
    {
        key: RoosterCommmandBarButtonKeys.Unlink,
        name: "Unlink",
        iconProps: _getIconProps("RemoveLink"),
        getDisabled: (formatState: FormatState) => !formatState.canUnlink,
        handleChange: (editor: Editor) => removeLink(editor)
    }
];

export const OutOfBoxCommandBarButtonMap = OutOfBoxCommandBarButtons.reduce(
    (result: { [key: string]: RoosterCommandBarButton }, item: RoosterCommandBarButton) => {
        result[item.key] = item;
        return result;
    },
    {} as { [key: string]: RoosterCommandBarButton }
);

function _getIconProps(name: string): IIconProps {
    return { className: `${RoosterCommandBarIconClassName} ms-Icon ms-Icon--${name}` };
}

function _getCheckedForHeader(formatState: FormatState): boolean {
    return formatState.headerLevel === this.headerLevel;
}

function _handleChangeForHeader(editor: Editor, props: RoosterCommandBarProps, state: RoosterCommandBarState): void {
    if (state.formatState.headerLevel === this.headerLevel) {
        toggleHeader(editor, 0);
    } else {
        toggleHeader(editor, this.headerLevel);
    }
}

function _colorCellOnRender(item: IContextualMenuItem): JSX.Element {
    const { color, cellBorderColor } = item.data as ColorInfo;
    return (
        <DefaultButton
            title={item.title}
            key={item.key}
            onClick={ev => item.onClick(ev as React.MouseEvent<HTMLElement>, item)}
        >
            <svg
                className="rooster-command-bar-color-cell"
                viewBox="0 0 20 20"
                fill={color}
                strokeWidth="1"
                stroke={cellBorderColor}
                focusable="false"
            >
                <rect width="100%" height="100%" />
            </svg>
        </DefaultButton>
    );
}

function _handleChangeForFontColor(editor: Editor): void {
    const { color } = this.data as ColorInfo;
    setTextColor(editor, color);
}

function _handleChangeForHighlight(editor: Editor): void {
    const { color } = this.data as ColorInfo;
    setBackgroundColor(editor, color);
}